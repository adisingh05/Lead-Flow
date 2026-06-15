import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { PrismaService } from "../prisma/prisma.service";

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
    const isProduction = process.env.NODE_ENV === "production";
    const mockAuthEnabled =
      !isProduction && process.env.ALLOW_MOCK_AUTH === "true";

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (mockAuthEnabled) {
        const mockClerkId =
          (request.headers["x-mock-clerk-id"] as string) || "mock-user-123";
        const mockEmail =
          (request.headers["x-mock-email"] as string) ||
          "developer@leadflow.ai";
        await this.resolveUserAndAttach(request, mockClerkId, mockEmail, true);
        return true;
      }
      throw new UnauthorizedException(
        "Missing or invalid Authorization header",
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      if (!this.jwks) {
        throw new UnauthorizedException("CLERK_JWKS_URL is not configured");
      }

      const decoded = jwt.decode(token, { complete: true }) as any;
      if (!decoded?.header?.kid) {
        throw new UnauthorizedException("Invalid token structure");
      }

      const key = await this.jwks.getSigningKey(decoded.header.kid);
      // In production require explicit issuer/audience configuration
      if (
        isProduction &&
        (!process.env.CLERK_ISSUER || !process.env.CLERK_AUDIENCE)
      ) {
        throw new UnauthorizedException(
          "CLERK_ISSUER and CLERK_AUDIENCE must be set in production",
        );
      }

      const payload = jwt.verify(token, key.getPublicKey(), {
        algorithms: ["RS256"],
        issuer: process.env.CLERK_ISSUER || undefined,
        audience: process.env.CLERK_AUDIENCE || undefined,
      }) as jwt.JwtPayload;
      const clerkId = payload.sub;
      if (!clerkId) {
        throw new UnauthorizedException("Token subject is missing");
      }
      const email = String(
        payload.email || payload.email_address || `${clerkId}@temp-leadflow.ai`,
      );

      await this.resolveUserAndAttach(request, clerkId, email, false);
      return true;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        "Token validation failed: " + err.message,
      );
    }
  }

  private async resolveUserAndAttach(
    request: any,
    clerkId: string,
    email: string,
    allowProvisioning: boolean,
  ) {
    let user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { organization: true },
    });

    if (!user) {
      if (!allowProvisioning) {
        throw new UnauthorizedException("User is not provisioned");
      }

      // Never auto-provision in production
      if (process.env.NODE_ENV === "production") {
        throw new UnauthorizedException(
          "Auto-provisioning is not permitted in production",
        );
      }

      // Dev convenience: require explicit opt-in to create a default org
      const allowOrgProvision = process.env.ALLOW_AUTO_PROVISION_ORG === "true";

      let org = await this.prisma.organization.findFirst();
      if (!org) {
        if (!allowOrgProvision) {
          throw new UnauthorizedException("Organization not provisioned");
        }

        org = await this.prisma.organization.create({
          data: {
            name: "Acme Outbound Corp",
            slug: "acme-outbound-corp",
          },
        });
      }

      user = await this.prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: "Dev",
          lastName: "User",
          role: "MEMBER",
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
