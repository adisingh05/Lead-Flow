import { Injectable } from '@nestjs/common';
import { CampaignStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { organizationId },
      include: { leads: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const leadIds = campaigns.flatMap((c) => c.leads.map((l) => l.id));

    const activities = leadIds.length
      ? await this.prisma.activity.findMany({
          where: { leadId: { in: leadIds } },
          select: { type: true, leadId: true },
        })
      : [];

    const leadToCampaign = new Map<string, string>();
    campaigns.forEach((c) =>
      c.leads.forEach((l) => leadToCampaign.set(l.id, c.id)),
    );

    type Stats = {
      sent: number;
      opened: number;
      replied: number;
      meetings: number;
    };
    const statsByCampaign = new Map<string, Stats>();
    campaigns.forEach((c) =>
      statsByCampaign.set(c.id, {
        sent: 0,
        opened: 0,
        replied: 0,
        meetings: 0,
      }),
    );

    for (const activity of activities) {
      const campaignId = activity.leadId
        ? leadToCampaign.get(activity.leadId)
        : undefined;
      if (!campaignId) continue;
      const stats = statsByCampaign.get(campaignId);
      if (!stats) continue;
      if (activity.type === 'EMAIL_SENT') stats.sent++;
      if (activity.type === 'EMAIL_OPENED') stats.opened++;
      if (activity.type === 'EMAIL_REPLIED') stats.replied++;
      if (activity.type === 'MEETING_SCHEDULED') stats.meetings++;
    }

    return campaigns.map(({ leads, ...campaign }) => {
      const stats = statsByCampaign.get(campaign.id) as Stats;
      return {
        ...campaign,
        leadsCount: leads.length,
        ...stats,
      };
    });
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

  async update(
    id: string,
    data: { name?: string; status?: string; description?: string },
  ) {
    const { status, ...rest } = data;
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...rest,
        ...(status ? { status: status as CampaignStatus } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
