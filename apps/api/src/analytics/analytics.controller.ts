import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/auth.guard';

@ApiTags('analytics')
@UseGuards(ClerkAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('monthly')
  getMonthly(@Query('organizationId') organizationId: string) {
    return this.analyticsService.getMonthly(organizationId);
  }
}
