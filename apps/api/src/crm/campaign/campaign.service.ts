import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignInput, CampaignStatus } from '@leadflow/types';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateCampaignInput) {
    return this.prisma.campaign.create({
      data: {
        ...input,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.campaign.findMany({
      where: { organizationId },
      include: { icp: true, sequence: true, _count: { select: { leads: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.campaign.findFirstOrThrow({
      where: { id, organizationId },
      include: {
        icp: true,
        sequence: { include: { steps: true } },
        leads: { include: { contact: true, company: true } },
      },
    });
  }

  async updateStatus(organizationId: string, id: string, status: CampaignStatus) {
    return this.prisma.campaign.update({
      where: { id, organizationId },
      data: { status },
    });
  }
}
