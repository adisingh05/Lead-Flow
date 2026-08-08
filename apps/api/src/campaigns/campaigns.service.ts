import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CampaignStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

// Valid status transitions — a campaign can only move forward in a defined flow
const ALLOWED_TRANSITIONS: Record<CampaignStatus, CampaignStatus[]> = {
  DRAFT: ['ACTIVE'],
  ACTIVE: ['PAUSED', 'COMPLETED'],
  PAUSED: ['ACTIVE', 'COMPLETED'],
  COMPLETED: ['ARCHIVED'],
  ARCHIVED: [],
};

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    opts: {
      search?: string;
      status?: CampaignStatus;
      sortBy?: 'name' | 'createdAt' | 'status';
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {},
  ) {
    const {
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = opts;

    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const },
              },
            ],
          }
        : {}),
    };

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: { leads: { select: { id: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count({ where }),
    ]);

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

    const items = campaigns.map(({ leads, ...campaign }) => {
      const stats = statsByCampaign.get(campaign.id) as Stats;
      return {
        ...campaign,
        leadsCount: leads.length,
        ...stats,
      };
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(organizationId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, organizationId },
      include: { sequences: true },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign not found`);
    }

    return campaign;
  }

  async getMetrics(organizationId: string, id: string) {
    await this.findOne(organizationId, id);

    const leads = await this.prisma.lead.findMany({
      where: { campaignId: id, organizationId },
      select: { id: true },
    });

    const leadIds = leads.map((l) => l.id);
    const totalLeads = leadIds.length;

    if (totalLeads === 0) {
      return {
        totalLeads: 0,
        sent: 0,
        opened: 0,
        replied: 0,
        meetings: 0,
        openRate: 0,
        replyRate: 0,
        meetingRate: 0,
      };
    }

    const activities = await this.prisma.activity.findMany({
      where: { leadId: { in: leadIds } },
      select: { type: true },
    });

    const count = (type: string) =>
      activities.filter((a) => a.type === type).length;

    const sent = count('EMAIL_SENT');
    const opened = count('EMAIL_OPENED');
    const replied = count('EMAIL_REPLIED');
    const meetings = count('MEETING_SCHEDULED');

    return {
      totalLeads,
      sent,
      opened,
      replied,
      meetings,
      openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
      replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
      meetingRate: sent > 0 ? Math.round((meetings / sent) * 100) : 0,
    };
  }

  async create(organizationId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        organizationId,
      },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateCampaignDto) {
    const existing = await this.findOne(organizationId, id);

    if (dto.status) {
      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(dto.status as CampaignStatus)) {
        throw new BadRequestException(
          `Cannot transition from ${existing.status} to ${dto.status}. ` +
            `Allowed: ${allowed.length ? allowed.join(', ') : 'none'}`,
        );
      }
    }

    const { status, ...rest } = dto;
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...rest,
        ...(status ? { status: status as CampaignStatus } : {}),
      },
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.prisma.campaign.delete({ where: { id } });
  }
}
