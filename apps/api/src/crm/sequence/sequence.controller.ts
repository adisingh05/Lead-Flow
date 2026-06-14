import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AuthUserContext, CreateSequenceInput } from '@leadflow/types';

@Controller('sequences')
@UseGuards(ClerkAuthGuard)
export class SequenceController {
  constructor(private readonly sequenceService: SequenceService) {}

  @Post()
  create(@CurrentUser() user: AuthUserContext, @Body() input: CreateSequenceInput) {
    return this.sequenceService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.sequenceService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUserContext, @Param('id') id: string) {
    return this.sequenceService.findOne(user.organizationId, id);
  }
}
