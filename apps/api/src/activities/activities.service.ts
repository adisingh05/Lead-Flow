import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── LIST ────────────────────────────────────────────────────────────────

  async findAll(
    organizationId: string,
    opts: {
      leadId?: string;
      contactId?: string;
      companyId?: string;
      campaignId?: string;
      userId?: string;
      type?: string;
      search?: string;
      from?: string;
      to?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {},
  ) {
    const {
      leadId,
      contactId,
      companyId,
      campaignId,
      userId,
      type,
      search,
      from,
      to,
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = opts;

    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = {
      organizationId,
      ...(leadId ? { leadId } : {}),
      ...(contactId ? { contactId } : {}),
      ...(companyId ? { companyId } : {}),
      ...(campaignId ? { campaignId } : {}),
      ...(userId ? { userId } : {}),
      ...(type ? { type: type as any } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const },
              },
            ],
          }
        : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              email: true,
            },
          },
          lead: {
            select: {
              id: true,
              status: true,
              contact: { select: { firstName: true, lastName: true } },
            },
          },
          contact: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          company: { select: { id: true, name: true } },
          campaign: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── TIMELINE ────────────────────────────────────────────────────────────

  /**
   * Same as findAll but defaults to a sensible timeline shape —
   * exposed as a dedicated endpoint so the frontend can treat it
   * as a first-class timeline feed rather than a generic list.
   */
  async getTimeline(
    organizationId: string,
    opts: {
      leadId?: string;
      contactId?: string;
      companyId?: string;
      campaignId?: string;
      userId?: string;
      type?: string;
      from?: string;
      to?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    return this.findAll(organizationId, {
      ...opts,
      sortOrder: 'desc',
    });
  }

  // ─── GET ONE ─────────────────────────────────────────────────────────────

  async findOne(organizationId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, organizationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        lead: {
          select: {
            id: true,
            status: true,
            contact: { select: { firstName: true, lastName: true } },
          },
        },
        contact: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        company: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  // ─── CREATE ──────────────────────────────────────────────────────────────

  async create(organizationId: string, userId: string, dto: CreateActivityDto) {
    // Validate every referenced entity belongs to the same organization
    if (dto.leadId) await this.verifyLeadOwnership(organizationId, dto.leadId);
    if (dto.contactId)
      await this.verifyContactOwnership(organizationId, dto.contactId);
    if (dto.companyId)
      await this.verifyCompanyOwnership(organizationId, dto.companyId);
    if (dto.campaignId)
      await this.verifyCampaignOwnership(organizationId, dto.campaignId);

    return this.prisma.activity.create({
      data: {
        type: dto.type as any,
        title: dto.title,
        description: dto.description,
        metadata: dto.metadata as Prisma.InputJsonValue,
        organizationId,
        userId,
        leadId: dto.leadId,
        contactId: dto.contactId,
        companyId: dto.companyId,
        campaignId: dto.campaignId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        lead: { select: { id: true, status: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────

  async update(
    organizationId: string,
    id: string,
    dto: Partial<CreateActivityDto>,
  ) {
    await this.findOne(organizationId, id);

    return this.prisma.activity.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.metadata
          ? { metadata: dto.metadata as Prisma.InputJsonValue }
          : {}),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        lead: { select: { id: true, status: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    await this.prisma.activity.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ─── RELATION VALIDATORS ─────────────────────────────────────────────────

  private async verifyLeadOwnership(organizationId: string, leadId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId },
    });
    if (!lead) throw new NotFoundException(`Lead ${leadId} not found`);
  }

  private async verifyContactOwnership(
    organizationId: string,
    contactId: string,
  ) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, organizationId },
    });
    if (!contact) throw new NotFoundException(`Contact ${contactId} not found`);
  }

  private async verifyCompanyOwnership(
    organizationId: string,
    companyId: string,
  ) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, organizationId },
    });
    if (!company) throw new NotFoundException(`Company ${companyId} not found`);
  }

  private async verifyCampaignOwnership(
    organizationId: string,
    campaignId: string,
  ) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId },
    });
    if (!campaign)
      throw new NotFoundException(`Campaign ${campaignId} not found`);
  }
}
