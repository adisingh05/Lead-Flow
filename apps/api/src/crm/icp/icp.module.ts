import { Module } from '@nestjs/common';
import { IcpService } from './icp.service';
import { IcpController } from './icp.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [IcpController],
  providers: [IcpService],
  exports: [IcpService],
})
export class IcpModule {}
