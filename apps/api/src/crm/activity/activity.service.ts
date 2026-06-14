import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, leadId?: string) {
    return this.prisma.activity.findMany({
      where: {
        organizationId,
        ...(leadId ? { leadId } : {}),
      },
      include: { user: true, lead: { include: { contact: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200, // safety cap
    });
  }
}
