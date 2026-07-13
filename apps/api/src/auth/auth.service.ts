import { ForbiddenException, Injectable } from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import type {
  ClerkClient,
  Organization as ClerkOrganization,
  OrganizationMembership as ClerkOrganizationMembership,
  User as ClerkUser,
} from '@clerk/backend';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthContext,
  AuthenticatedMembership,
  AuthenticatedOrganization,
  AuthenticatedUser,
  ClerkTokenClaims,
} from './auth.types';

@Injectable()
export class ClerkAuthService {
  private readonly clerkClient: ClerkClient;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is not configured');
    }

    this.clerkClient = createClerkClient({ secretKey });
  }

  async authenticate(token: string): Promise<AuthContext> {
    const claims = (await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })) as ClerkTokenClaims;

    if (!claims.org_id) {
      throw new ForbiddenException('An active organization is required');
    }

    const [clerkUser, clerkOrganization, clerkMemberships] = await Promise.all([
      this.clerkClient.users.getUser(claims.sub),
      this.clerkClient.organizations.getOrganization({
        organizationId: claims.org_id,
      }),
      this.clerkClient.organizations.getOrganizationMembershipList({
        organizationId: claims.org_id,
        userId: [claims.sub],
        limit: 1,
      }),
    ]);

    const currentMembership = clerkMemberships.data.find(
      (membership) => membership.publicUserData?.userId === claims.sub,
    );

    if (!currentMembership) {
      throw new ForbiddenException(
        'A valid organization membership is required',
      );
    }

    const currentRole = this.resolveMembershipRole(
      clerkOrganization,
      currentMembership,
      claims.sub,
    );

    const result = await this.prisma.$transaction(async (transaction) => {
      const localUser = await this.upsertUser(transaction, clerkUser);
      const localOrganization = await this.upsertOrganization(
        transaction,
        clerkOrganization,
      );
      const localMembership = await transaction.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: localOrganization.id,
            userId: localUser.id,
          },
        },
        create: {
          organizationId: localOrganization.id,
          userId: localUser.id,
          role: currentRole,
        },
        update: { role: currentRole },
      });

      return {
        user: localUser,
        organization: localOrganization,
        membership: this.toAuthenticatedMembership(localMembership),
      };
    });

    return {
      user: result.user,
      organization: { ...result.organization, role: currentRole },
      membership: result.membership,
      role: currentRole,
      claims,
    };
  }

  private async upsertUser(
    transaction: Prisma.TransactionClient,
    clerkUser: ClerkUser,
  ): Promise<AuthenticatedUser> {
    const email = this.getPrimaryEmail(clerkUser);

    const localUser = await transaction.user.upsert({
      where: { clerkId: clerkUser.id },
      create: {
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatar: clerkUser.imageUrl,
      },
      update: {
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatar: clerkUser.imageUrl,
      },
    });

    return {
      id: localUser.id,
      clerkId: localUser.clerkId,
      email: localUser.email,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      avatar: localUser.avatar,
    };
  }

  private async upsertOrganization(
    transaction: Prisma.TransactionClient,
    clerkOrganization: ClerkOrganization,
  ): Promise<Omit<AuthenticatedOrganization, 'role'>> {
    const existingOrganization = await transaction.organization.findFirst({
      where: {
        OR: [
          { clerkId: clerkOrganization.id },
          { slug: clerkOrganization.slug },
        ],
      },
    });

    const organizationData = {
      clerkId: clerkOrganization.id,
      name: clerkOrganization.name,
      slug: clerkOrganization.slug || this.slugify(clerkOrganization.name),
      logo: clerkOrganization.imageUrl || null,
    };

    const localOrganization = existingOrganization
      ? await transaction.organization.update({
          where: { id: existingOrganization.id },
          data: organizationData,
        })
      : await transaction.organization.create({
          data: organizationData,
        });

    return {
      id: localOrganization.id,
      clerkId: localOrganization.clerkId,
      name: localOrganization.name,
      slug: localOrganization.slug,
    };
  }

  private resolveMembershipRole(
    clerkOrganization: ClerkOrganization | null,
    membership: ClerkOrganizationMembership,
    memberUserId: string,
  ): UserRole {
    if (clerkOrganization?.createdBy === memberUserId) {
      return UserRole.OWNER;
    }

    return this.mapClerkRole(membership.role);
  }

  private mapClerkRole(role?: string): UserRole {
    const normalizedRole = role?.toLowerCase() ?? '';

    if (normalizedRole.includes('owner')) {
      return UserRole.OWNER;
    }

    if (normalizedRole.includes('admin')) {
      return UserRole.ADMIN;
    }

    if (normalizedRole.includes('viewer') || normalizedRole.includes('read')) {
      return UserRole.VIEWER;
    }

    return UserRole.MEMBER;
  }

  private toAuthenticatedMembership(membership: {
    id: string;
    organizationId: string;
    userId: string;
    role: UserRole;
  }): AuthenticatedMembership {
    return {
      id: membership.id,
      organizationId: membership.organizationId,
      userId: membership.userId,
      role: membership.role,
    };
  }

  private getPrimaryEmail(clerkUser: ClerkUser): string {
    const primaryEmail = clerkUser.emailAddresses.find(
      (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId,
    );

    return (
      primaryEmail?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      `clerk-${clerkUser.id}@leadflow.local`
    );
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }
}
