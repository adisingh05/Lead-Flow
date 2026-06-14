import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActorType } from '@leadflow/types';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async createRun(organizationId: string, agentType: ActorType) {
    return this.prisma.agentRun.create({
      data: {
        organizationId,
        agentType,
        status: 'RUNNING',
      },
    });
  }

  async updateRunStatus(organizationId: string, id: string, status: string, duration?: number, tokensUsed?: number) {
    return this.prisma.agentRun.update({
      where: { id, organizationId },
      data: {
        status,
        duration,
        tokensUsed,
        completedAt: new Date(),
      },
    });
  }

  async createTask(agentRunId: string, payload: any, assignedAgent: ActorType) {
    return this.prisma.agentTask.create({
      data: {
        agentRunId,
        payload,
        status: 'PENDING',
        assignedAgent,
      },
    });
  }

  async updateTaskStatus(id: string, status: string, resultSummary?: string) {
    return this.prisma.agentTask.update({
      where: { id },
      data: {
        status,
        resultSummary,
      },
    });
  }
}
