import { Global, Module } from '@nestjs/common';
import { ClerkAuthGuard } from './auth.guard';
import { ClerkAuthService } from './auth.service';

@Global()
@Module({
  providers: [ClerkAuthGuard, ClerkAuthService],
  exports: [ClerkAuthGuard, ClerkAuthService],
})
export class AuthModule {}
