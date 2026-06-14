import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSequenceInput } from '@leadflow/types';

@Injectable()
export class SequenceService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateSequenceInput) {
    return this.prisma.sequence.create({
      data: {
        name: input.name,
        description: input.description,
        organizationId,
        steps: {
          create: input.steps?.map((step) => ({
            stepNumber: step.stepNumber,
            type: step.type,
            delayDays: step.delayDays,
            templateSubject: step.templateSubject,
            templateBody: step.templateBody,
          })) || [],
        },
      },
      include: { steps: true },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.sequence.findMany({
      where: { organizationId },
      include: { steps: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.sequence.findFirstOrThrow({
      where: { id, organizationId },
      include: { steps: true },
    });
  }
}
