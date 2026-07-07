import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.lead.findMany({
      where: { organizationId },
      include: { company: true, contact: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { company: true, contact: true },
    });
  }

  async create(data: {
    organizationId: string;
    companyId?: string;
    contactId?: string;
    campaignId?: string;
    source?: string;
    value?: number;
  }) {
    return this.prisma.lead.create({ data });
  }

  async update(id: string, data: { status?: string; score?: number }) {
    return this.prisma.lead.update({ where: { id }, data: data as any });
  }

  async remove(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }
}
