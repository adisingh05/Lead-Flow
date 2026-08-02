import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentOrganization } from '../auth/current-organization.decorator';
import type { AuthenticatedOrganization } from '../auth/auth.types';

@ApiTags('campaigns')
@UseGuards(ClerkAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll(@CurrentOrganization() org: AuthenticatedOrganization) {
    return this.campaignsService.findAll(org.id);
  }

  @Get(':id')
  findOne(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.campaignsService.findOne(org.id, id);
  }

  @Post()
  create(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(org.id, dto);
  }

  @Put(':id')
  update(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(org.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.campaignsService.remove(org.id, id);
  }
}
