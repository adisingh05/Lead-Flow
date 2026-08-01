import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AuthUserContext, CampaignStatus } from '@leadflow/types';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
} from '../dto/crm.dto';

@ApiTags('Campaigns')
@ApiBearerAuth()
@Controller('campaigns')
@UseGuards(ClerkAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'List campaigns with optional search, filter, pagination',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, enum: CampaignStatus })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of campaigns' })
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query('search') search?: string,
    @Query('status') status?: CampaignStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.campaignService.findAll(user.organizationId, {
      search,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiResponse({ status: 200, description: 'Campaign found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.campaignService.findOne(user.organizationId, id);
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get lead funnel metrics for a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign metrics' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getMetrics(
    @CurrentUser() user: AuthUserContext,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.campaignService.getMetrics(user.organizationId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created' })
  @ApiResponse({
    status: 404,
    description: 'Referenced ICP or Sequence not in this organization',
  })
  create(@CurrentUser() user: AuthUserContext, @Body() dto: CreateCampaignDto) {
    return this.campaignService.create(user.organizationId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @CurrentUser() user: AuthUserContext,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(user.organizationId, id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campaign status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignService.updateStatus(
      user.organizationId,
      id,
      dto.status,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(
    @CurrentUser() user: AuthUserContext,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.campaignService.remove(user.organizationId, id);
  }
}
