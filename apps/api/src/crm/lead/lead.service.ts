import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadInput, LeadStatus } from '@leadflow/types';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, userId: string, input: CreateLeadInput) {
    const lead = await this.prisma.lead.create({
      data: {
        ...input,
        organizationId,
      },
      include: { contact: true, company: true },
    });

    // Create audit log activity
    await this.prisma.activity.create({
      data: {
        organizationId,
        leadId: lead.id,
        userId,
        actorType: 'USER',
        type: 'LEAD_CREATED',
        description: `Lead created for contact ${lead.contact.firstName} ${lead.contact.lastName || ''} at ${lead.company.name}`,
        metadata: { source: input.source },
      },
    });

    return lead;
  }

  async findAll(organizationId: string, campaignId?: string, status?: LeadStatus, icpId?: string) {
    return this.prisma.lead.findMany({
      where: {
        organizationId,
        ...(campaignId ? { campaignId } : {}),
        ...(status ? { status } : {}),
        ...(icpId ? { icpId } : {}),
      },
      include: { contact: true, company: true, campaign: true, icp: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.lead.findFirstOrThrow({
      where: { id, organizationId },
      include: { contact: true, company: true, campaign: true, icp: true, messages: true, activities: true },
    });
  }

  async updateStatus(organizationId: string, userId: string, id: string, status: LeadStatus) {
    const oldLead = await this.findOne(organizationId, id);
    const updatedLead = await this.prisma.lead.update({
      where: { id, organizationId },
      data: { status },
    });

    await this.prisma.activity.create({
      data: {
        organizationId,
        leadId: id,
        userId,
        actorType: 'USER',
        type: 'LEAD_STATUS_CHANGED',
        description: `Lead status updated from ${oldLead.status} to ${status}`,
        metadata: { oldStatus: oldLead.status, newStatus: status },
      },
    });

    return updatedLead;
  }

  async updateEnrichment(organizationId: string, id: string, data: any, score?: number) {
    return this.prisma.lead.update({
      where: { id, organizationId },
      data: {
        enrichmentData: data,
        ...(score !== undefined ? { score } : {}),
      },
    });
  }
}
