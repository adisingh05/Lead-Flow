import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentOrganization } from '../auth/current-organization.decorator';
import type { AuthenticatedOrganization } from '../auth/auth.types';
import { CampaignStatus } from '@prisma/client';

@ApiTags('campaigns')
@UseGuards(ClerkAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, enum: CampaignStatus })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'createdAt', 'status'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Query('search') search?: string,
    @Query('status') status?: CampaignStatus,
    @Query('sortBy') sortBy?: 'name' | 'createdAt' | 'status',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.campaignsService.findAll(org.id, {
      search,
      status,
      sortBy,
      sortOrder,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.campaignsService.findOne(org.id, id);
  }

  @Get(':id/metrics')
  getMetrics(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.campaignsService.getMetrics(org.id, id);
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
