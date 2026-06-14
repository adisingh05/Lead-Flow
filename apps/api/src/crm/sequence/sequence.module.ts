import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { SequenceController } from './sequence.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SequenceController],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
