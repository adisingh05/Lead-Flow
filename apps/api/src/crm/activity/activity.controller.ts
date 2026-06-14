import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AuthUserContext } from '@leadflow/types';

@Controller('activities')
@UseGuards(ClerkAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUserContext, @Query('leadId') leadId?: string) {
    return this.activityService.findAll(user.organizationId, leadId);
  }
}
