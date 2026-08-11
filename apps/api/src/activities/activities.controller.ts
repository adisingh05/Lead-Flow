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
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentOrganization } from '../auth/current-organization.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type {
  AuthenticatedOrganization,
  AuthenticatedUser,
} from '../auth/auth.types';

@ApiTags('activities')
@UseGuards(ClerkAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiQuery({ name: 'leadId', required: false })
  @ApiQuery({ name: 'contactId', required: false })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'campaignId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Query('leadId') leadId?: string,
    @Query('contactId') contactId?: string,
    @Query('companyId') companyId?: string,
    @Query('campaignId') campaignId?: string,
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activitiesService.findAll(org.id, {
      leadId,
      contactId,
      companyId,
      campaignId,
      userId,
      type,
      search,
      from,
      to,
      sortOrder,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('timeline')
  @ApiQuery({ name: 'leadId', required: false })
  @ApiQuery({ name: 'contactId', required: false })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'campaignId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getTimeline(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Query('leadId') leadId?: string,
    @Query('contactId') contactId?: string,
    @Query('companyId') companyId?: string,
    @Query('campaignId') campaignId?: string,
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activitiesService.getTimeline(org.id, {
      leadId,
      contactId,
      companyId,
      campaignId,
      userId,
      type,
      from,
      to,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.activitiesService.findOne(org.id, id);
  }

  @Post()
  create(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateActivityDto,
  ) {
    return this.activitiesService.create(org.id, user.id, dto);
  }

  @Put(':id')
  update(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(org.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentOrganization() org: AuthenticatedOrganization,
    @Param('id') id: string,
  ) {
    return this.activitiesService.remove(org.id, id);
  }
}
