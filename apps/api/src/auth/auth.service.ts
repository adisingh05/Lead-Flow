import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    const [clerkUser, clerkOrganization, clerkMemberships] = await Promise.all([
      this.clerkClient.users.getUser(claims.sub),
      claims.org_id
        ? this.clerkClient.organizations.getOrganization({
            organizationId: claims.org_id,
          })
        : Promise.resolve(null),
      claims.org_id
        ? this.clerkClient.organizations.getOrganizationMembershipList({
            organizationId: claims.org_id,
            limit: 100,
          })
        : Promise.resolve(null),
    ]);

    const clerkMembershipsList = clerkMemberships?.data ?? [];
    const clerkUsersToSync = new Set<string>([clerkUser.id]);

    for (const membership of clerkMembershipsList) {
      const memberUserId = membership.publicUserData?.userId;

      if (memberUserId) {
        clerkUsersToSync.add(memberUserId);
      }
    }

    const clerkUsers = await Promise.all(
      [...clerkUsersToSync].map(
        async (userId) =>
          [userId, await this.clerkClient.users.getUser(userId)] as const,
      ),
    );

    const clerkUsersById = new Map<string, ClerkUser>(clerkUsers);
    const currentMembership = clerkMembershipsList.find(
      (membership) => membership.publicUserData?.userId === clerkUser.id,
    );
    const currentRole = this.resolveCurrentRole(
      clerkOrganization,
      claims,
      currentMembership,
    );

    const result = await this.prisma.$transaction(async (transaction) => {
      const syncedUsers = new Map<string, AuthenticatedUser>();

      for (const [userId, clerkUserRecord] of clerkUsersById) {
        const localUser = await this.upsertUser(transaction, clerkUserRecord);
        syncedUsers.set(userId, localUser);
      }

      let localOrganization: Omit<AuthenticatedOrganization, 'role'> | null =
        null;

      if (clerkOrganization) {
        localOrganization = await this.upsertOrganization(
          transaction,
          clerkOrganization,
        );

        for (const membership of clerkMembershipsList) {
          const memberUserId = membership.publicUserData?.userId;

          if (!memberUserId) {
            continue;
          }

          const localMemberUser = syncedUsers.get(memberUserId);

          if (!localMemberUser) {
            continue;
          }

          await transaction.organizationMember.upsert({
            where: {
              organizationId_userId: {
                organizationId: localOrganization.id,
                userId: localMemberUser.id,
              },
            },
            create: {
              organizationId: localOrganization.id,
              userId: localMemberUser.id,
              role: this.resolveMembershipRole(
                clerkOrganization,
                membership,
                memberUserId,
              ),
            },
            update: {
              role: this.resolveMembershipRole(
                clerkOrganization,
                membership,
                memberUserId,
              ),
            },
          });
        }

        const localCurrentUser = syncedUsers.get(clerkUser.id);

        if (!localCurrentUser) {
          throw new UnauthorizedException('Unable to sync authenticated user');
        }

        await transaction.organizationMember.upsert({
          where: {
            organizationId_userId: {
              organizationId: localOrganization.id,
              userId: localCurrentUser.id,
            },
          },
          create: {
            organizationId: localOrganization.id,
            userId: localCurrentUser.id,
            role: currentRole,
          },
          update: {
            role: currentRole,
          },
        });
      }

      return {
        user: syncedUsers.get(clerkUser.id),
        organization: localOrganization,
      };
    });

    if (!result.user) {
      throw new UnauthorizedException('Unable to sync authenticated user');
    }

    return {
      user: result.user,
      organization: result.organization
        ? { ...result.organization, role: currentRole }
        : null,
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

  private resolveCurrentRole(
    clerkOrganization: ClerkOrganization | null,
    claims: ClerkTokenClaims,
    currentMembership: ClerkOrganizationMembership | undefined,
  ): UserRole {
    if (clerkOrganization?.createdBy === claims.sub) {
      return UserRole.OWNER;
    }

    if (currentMembership) {
      return this.resolveMembershipRole(
        clerkOrganization,
        currentMembership,
        claims.sub,
      );
    }

    return this.mapClerkRole(claims.org_role);
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
