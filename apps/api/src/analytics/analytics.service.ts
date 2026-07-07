import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthly(organizationId: string, monthsBack = 6) {
    const now = new Date();
    const months: { start: Date; end: Date; label: string }[] = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      months.push({
        start,
        end,
        label: start.toLocaleString('en-US', { month: 'short' }),
      });
    }

    const earliest = months[0].start;

    const leads = await this.prisma.lead.findMany({
      where: { organizationId, createdAt: { gte: earliest } },
      select: { id: true, status: true, createdAt: true },
    });

    const leadIds = leads.map((l) => l.id);

    const activities = leadIds.length
      ? await this.prisma.activity.findMany({
          where: { leadId: { in: leadIds }, createdAt: { gte: earliest } },
          select: { type: true, createdAt: true },
        })
      : [];

    return months.map(({ start, end, label }) => {
      const monthLeads = leads.filter(
        (l) => l.createdAt >= start && l.createdAt < end,
      );
      const contacted = monthLeads.filter((l) => l.status !== 'NEW').length;
      const converted = monthLeads.filter(
        (l) => l.status === 'CONVERTED',
      ).length;

      const monthActivities = activities.filter(
        (a) => a.createdAt >= start && a.createdAt < end,
      );
      const sent = monthActivities.filter(
        (a) => a.type === 'EMAIL_SENT',
      ).length;
      const opened = monthActivities.filter(
        (a) => a.type === 'EMAIL_OPENED',
      ).length;
      const replied = monthActivities.filter(
        (a) => a.type === 'EMAIL_REPLIED',
      ).length;
      const meetings = monthActivities.filter(
        (a) => a.type === 'MEETING_SCHEDULED',
      ).length;

      return {
        month: label,
        leads: monthLeads.length,
        contacted,
        converted,
        openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
        replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
        meetings,
      };
    });
  }
}
