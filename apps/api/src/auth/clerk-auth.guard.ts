import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private jwks: jwksRsa.JwksClient | null = null;

  constructor(private prisma: PrismaService) {
    const jwksUrl = process.env.CLERK_JWKS_URL;
    if (jwksUrl) {
      this.jwks = jwksRsa({
        jwksUri: jwksUrl,
        cache: true,
        rateLimit: true,
      });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Local dev fallback
      if (process.env.NODE_ENV !== 'production' || !process.env.CLERK_JWKS_URL) {
        const mockClerkId = (request.headers['x-mock-clerk-id'] as string) || 'mock-user-123';
        const mockEmail = (request.headers['x-mock-email'] as string) || 'developer@leadflow.ai';
        await this.resolveUserAndAttach(request, mockClerkId, mockEmail);
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.decode(token, { complete: true }) as any;
      if (!decoded || !decoded.payload) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const clerkId = decoded.payload.sub;
      const email = decoded.payload.email || decoded.payload.email_address || `${clerkId}@temp-leadflow.ai`;

      if (this.jwks) {
        const kid = decoded.header.kid;
        const key = await this.jwks.getSigningKey(kid);
        const publicKey = key.getPublicKey();
        jwt.verify(token, publicKey);
      }

      await this.resolveUserAndAttach(request, clerkId, email);
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Token validation failed: ' + err.message);
    }
  }

  private async resolveUserAndAttach(request: any, clerkId: string, email: string) {
    let user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { organization: true },
    });

    if (!user) {
      // Ensure we have at least one organization
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: {
            name: 'Acme Outbound Corp',
            slug: 'acme-outbound-corp',
          },
        });
      }

      user = await this.prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'OWNER',
          organizationId: org.id,
        },
        include: { organization: true },
      });
    }

    request.user = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };
  }
}
