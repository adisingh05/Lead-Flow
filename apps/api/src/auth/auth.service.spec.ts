import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { createClerkClient, verifyToken } from '@clerk/backend';
import type {
  ClerkClient,
  Organization as ClerkOrganization,
  User as ClerkUser,
} from '@clerk/backend';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClerkAuthService } from './auth.service';

jest.mock('@clerk/backend', () => ({
  createClerkClient: jest.fn(),
  verifyToken: jest.fn(),
}));

describe('ClerkAuthService', () => {
  const clerkUser = {
    id: 'clerk_user_1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    imageUrl: 'https://example.com/avatar.png',
    primaryEmailAddressId: 'email_1',
    emailAddresses: [{ id: 'email_1', emailAddress: 'ada@example.com' }],
  } as unknown as ClerkUser;

  const clerkOrganization = {
    id: 'org_1',
    name: 'LeadFlow',
    slug: 'leadflow',
    imageUrl: 'https://example.com/logo.png',
    createdBy: 'another_clerk_user',
  } as unknown as ClerkOrganization;

  beforeEach(() => {
    process.env.CLERK_SECRET_KEY = 'test_secret';
    jest.clearAllMocks();
  });

  it('syncs only the authenticated user, organization, and membership', async () => {
    const transaction = {
      user: {
        upsert: jest.fn().mockResolvedValue({
          id: 'user_1',
          clerkId: 'clerk_user_1',
          email: 'ada@example.com',
          firstName: 'Ada',
          lastName: 'Lovelace',
          avatar: 'https://example.com/avatar.png',
        }),
      },
      organization: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'organization_1',
          clerkId: 'org_1',
          name: 'LeadFlow',
          slug: 'leadflow',
        }),
      },
      organizationMember: {
        upsert: jest.fn().mockResolvedValue({
          id: 'membership_1',
          organizationId: 'organization_1',
          userId: 'user_1',
          role: UserRole.ADMIN,
        }),
      },
    } as unknown as Prisma.TransactionClient;

    const prisma = {
      $transaction: jest
        .fn()
        .mockImplementation(
          async (
            callback: (client: Prisma.TransactionClient) => Promise<unknown>,
          ) => callback(transaction),
        ),
    } as unknown as PrismaService;

    const clerkClient = {
      users: { getUser: jest.fn().mockResolvedValue(clerkUser) },
      organizations: {
        getOrganization: jest.fn().mockResolvedValue(clerkOrganization),
        getOrganizationMembershipList: jest.fn().mockResolvedValue({
          data: [
            {
              id: 'clerk_membership_1',
              role: 'org:admin',
              publicUserData: { userId: 'clerk_user_1' },
            },
          ],
        }),
      },
    } as unknown as ClerkClient;

    jest.mocked(createClerkClient).mockReturnValue(clerkClient);
    jest.mocked(verifyToken).mockResolvedValue({
      sub: 'clerk_user_1',
      org_id: 'org_1',
    } as never);

    const service = new ClerkAuthService(prisma);

    await expect(service.authenticate('valid-token')).resolves.toMatchObject({
      role: UserRole.ADMIN,
      membership: { id: 'membership_1', role: UserRole.ADMIN },
    });

    const getMembershipList = clerkClient.organizations
      .getOrganizationMembershipList as jest.Mock;
    const getUser = clerkClient.users.getUser as jest.Mock;
    const upsertMember = transaction.organizationMember.upsert as jest.Mock;

    expect(getMembershipList).toHaveBeenCalledWith({
      organizationId: 'org_1',
      userId: ['clerk_user_1'],
      limit: 1,
    });
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(upsertMember).toHaveBeenCalledTimes(1);
  });

  it('rejects authenticated users without an active organization', async () => {
    const prisma = {} as PrismaService;
    jest
      .mocked(verifyToken)
      .mockResolvedValue({ sub: 'clerk_user_1' } as never);
    const service = new ClerkAuthService(prisma);

    await expect(service.authenticate('valid-token')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
