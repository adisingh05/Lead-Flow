import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AuthUserContext, CreateCampaignInput, CampaignStatus } from '@leadflow/types';

@Controller('campaigns')
@UseGuards(ClerkAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@CurrentUser() user: AuthUserContext, @Body() input: CreateCampaignInput) {
    return this.campaignService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.campaignService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUserContext, @Param('id') id: string) {
    return this.campaignService.findOne(user.organizationId, id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param('id') id: string,
    @Body('status') status: CampaignStatus,
  ) {
    return this.campaignService.updateStatus(user.organizationId, id, status);
  }
}
