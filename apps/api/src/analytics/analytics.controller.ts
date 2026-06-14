import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUserContext } from '@leadflow/types';

@Controller('analytics')
@UseGuards(ClerkAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardSummary(@CurrentUser() user: AuthUserContext) {
    return this.analyticsService.getDashboardSummary(user.organizationId);
  }
}
