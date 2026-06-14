import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeadService } from './lead.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AuthUserContext, CreateLeadInput, LeadStatus } from '@leadflow/types';

@Controller('leads')
@UseGuards(ClerkAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@CurrentUser() user: AuthUserContext, @Body() input: CreateLeadInput) {
    return this.leadService.create(user.organizationId, user.id, input);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query('campaignId') campaignId?: string,
    @Query('status') status?: LeadStatus,
    @Query('icpId') icpId?: string,
  ) {
    return this.leadService.findAll(user.organizationId, campaignId, status, icpId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUserContext, @Param('id') id: string) {
    return this.leadService.findOne(user.organizationId, id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
  ) {
    return this.leadService.updateStatus(user.organizationId, user.id, id, status);
  }
}
