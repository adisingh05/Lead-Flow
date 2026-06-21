import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.campaign.findMany({ where: { organizationId } });
  }

  async findOne(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { sequences: true },
    });
  }

  async create(data: { name: string; organizationId: string }) {
    return this.prisma.campaign.create({ data });
  }

  async update(id: string, data: { name?: string; status?: string }) {
    return this.prisma.campaign.update({ where: { id }, data: data as any });
  }

  async remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
