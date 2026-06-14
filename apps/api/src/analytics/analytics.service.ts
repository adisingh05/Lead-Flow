import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(organizationId: string) {
    const [leadsCount, activeCampaigns, totalMessages, respondedLeads] = await Promise.all([
      this.prisma.lead.count({ where: { organizationId } }),
      this.prisma.campaign.count({ where: { organizationId, status: 'ACTIVE' } }),
      this.prisma.message.count({ where: { organizationId } }),
      this.prisma.lead.count({ where: { organizationId, status: 'RESPONDED' } }),
    ]);

    const leadStatusGrouping = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: { id: true },
    });

    const leadSourceGrouping = await this.prisma.lead.groupBy({
      by: ['source'],
      where: { organizationId },
      _count: { id: true },
    });

    return {
      summary: {
        totalLeads: leadsCount,
        activeCampaigns,
        totalMessages,
        replies: respondedLeads,
        replyRate: leadsCount > 0 ? Math.round((respondedLeads / leadsCount) * 100) : 0,
      },
      byStatus: leadStatusGrouping.map((g) => ({ status: g.status, count: g._count.id })),
      bySource: leadSourceGrouping.map((g) => ({ source: g.source || 'UNKNOWN', count: g._count.id })),
    };
  }
}
