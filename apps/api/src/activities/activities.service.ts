import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // Activities have no direct organizationId column - they hang off a
  // Contact or a Lead, which are themselves org-scoped. Filter through
  // that relation so activities stay tenant-isolated.
  async findAll(organizationId: string, leadId?: string, contactId?: string) {
    return this.prisma.activity.findMany({
      where: {
        ...(leadId ? { leadId } : {}),
        ...(contactId ? { contactId } : {}),
        OR: [{ lead: { organizationId } }, { contact: { organizationId } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.activity.findUnique({ where: { id } });
  }

  async create(dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        type: dto.type,
        metadata: dto.metadata as Prisma.InputJsonValue,
        userId: dto.userId,
        contactId: dto.contactId,
        leadId: dto.leadId,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.activity.delete({ where: { id } });
  }
}
