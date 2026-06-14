import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUserContext, ActorType } from '@leadflow/types';

@Controller('agents')
@UseGuards(ClerkAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('runs')
  createRun(@CurrentUser() user: AuthUserContext, @Body('agentType') agentType: ActorType) {
    return this.agentsService.createRun(user.organizationId, agentType);
  }
}
