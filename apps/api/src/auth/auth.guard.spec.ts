import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { AuthenticatedRequest } from './auth.types';
import { ClerkAuthGuard } from './auth.guard';
import type { ClerkAuthService } from './auth.service';

describe('ClerkAuthGuard', () => {
  const request = {
    headers: { authorization: 'Bearer valid-token' },
  } as AuthenticatedRequest;
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const authenticatedContext = {
    user: {
      id: 'user_1',
      clerkId: 'clerk_user_1',
      email: 'user@example.com',
      firstName: null,
      lastName: null,
      avatar: null,
    },
    organization: {
      id: 'organization_1',
      clerkId: 'org_1',
      name: 'LeadFlow',
      slug: 'leadflow',
      role: UserRole.MEMBER,
    },
    membership: {
      id: 'membership_1',
      organizationId: 'organization_1',
      userId: 'user_1',
      role: UserRole.MEMBER,
    },
    role: UserRole.MEMBER,
    claims: { sub: 'clerk_user_1', org_id: 'org_1' },
  };

  beforeEach(() => {
    request.auth = undefined;
  });

  it('rejects a request without a bearer token', async () => {
    const authService = {
      authenticate: jest.fn(),
    } as unknown as ClerkAuthService;
    const guard = new ClerkAuthGuard(authService);
    request.headers.authorization = undefined;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('attaches the verified authentication context to the request', async () => {
    const authService = {
      authenticate: jest.fn().mockResolvedValue(authenticatedContext),
    } as unknown as ClerkAuthService;
    const guard = new ClerkAuthGuard(authService);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.auth).toEqual(authenticatedContext);
  });

  it('preserves forbidden authentication states', async () => {
    const authService = {
      authenticate: jest
        .fn()
        .mockRejectedValue(new ForbiddenException('Membership is required')),
    } as unknown as ClerkAuthService;
    const guard = new ClerkAuthGuard(authService);

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('maps invalid token errors to unauthorized', async () => {
    const authService = {
      authenticate: jest.fn().mockRejectedValue(new Error('Invalid token')),
    } as unknown as ClerkAuthService;
    const guard = new ClerkAuthGuard(authService);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
