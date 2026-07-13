import type { UserRole } from '@prisma/client';
import type { Request } from 'express';

export type ClerkTokenClaims = {
  sub: string;
  org_id?: string;
  org_slug?: string;
  org_role?: string;
};

export type AuthenticatedUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
};

export type AuthenticatedOrganization = {
  id: string;
  clerkId: string | null;
  name: string;
  slug: string;
  role: UserRole;
};

export type AuthenticatedMembership = {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
};

export type AuthContext = {
  user: AuthenticatedUser;
  organization: AuthenticatedOrganization;
  membership: AuthenticatedMembership;
  role: UserRole;
  claims: ClerkTokenClaims;
};

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}
