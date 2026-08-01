import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignStatus } from '@leadflow/types';
import { CreateCampaignDto, UpdateCampaignDto } from '../dto/crm.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns campaigns belonging to the authenticated organization.
   * Supports optional search (name/description), status filter,
   * and pagination. organizationId always from AuthContext.
   */
  async findAll(
    organizationId: string,
    opts: {
      search?: string;
      status?: CampaignStatus;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const { search, status, page = 1, limit = 20 } = opts;
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

    const [items, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          icp: true,
          sequence: true,
          _count: { select: { leads: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Fetches a single campaign scoped to the authenticated organization.
   * Returns NotFoundException for both "not found" and "belongs to another org".
   */
  async findOne(organizationId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, organizationId },
      include: {
        icp: true,
        sequence: { include: { steps: true } },
        leads: { include: { contact: true, company: true } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign ${id} not found`);
    }

    return campaign;
  }

  /**
   * Returns per-campaign lead funnel metrics.
   * All counts are scoped to the authenticated organization.
   */
  async getMetrics(organizationId: string, id: string) {
    await this.findOne(organizationId, id);

    const leadCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { organizationId, campaignId: id },
      _count: { id: true },
    });

    const countByStatus = (status: string) =>
      leadCounts.find(
        (g: { status: string; _count: { id: number } }) => g.status === status,
      )?._count.id ?? 0;

    const totalLeads = leadCounts.reduce(
      (sum: number, g: { status: string; _count: { id: number } }) =>
        sum + g._count.id,
      0,
    );
    const contacted = countByStatus('CONTACTED');
    const replied = countByStatus('RESPONDED');
    const qualified = countByStatus('QUALIFIED');
    const converted = countByStatus('WON');
    const lost = countByStatus('LOST');

    return {
      totalLeads,
      contacted,
      replied,
      qualified,
      converted,
      lost,
      conversionRate:
        totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0,
      replyRate: totalLeads > 0 ? Math.round((replied / totalLeads) * 100) : 0,
      completionPct:
        totalLeads > 0
          ? Math.round(
              ((contacted + replied + qualified + converted + lost) /
                totalLeads) *
                100,
            )
          : 0,
    };
  }

  /**
   * Creates a campaign owned by the authenticated organization.
   * Validates optional icpId and sequenceId belong to the same org.
   */
  async create(
    organizationId: string,
    dto: Omit<CreateCampaignDto, 'organizationId'>,
  ) {
    const { name, description, icpId, sequenceId, type, settings } = dto;

    if (icpId) await this.verifyIcpOwnership(organizationId, icpId);
    if (sequenceId)
      await this.verifySequenceOwnership(organizationId, sequenceId);

    return this.prisma.campaign.create({
      data: {
        name,
        description,
        icpId,
        sequenceId,
        type,
        settings,
        organizationId,
      },
      include: { icp: true, sequence: true },
    });
  }

  /**
   * Updates a campaign after verifying it belongs to the authenticated org.
   * Validates any updated icpId or sequenceId. organizationId never updated.
   */
  async update(organizationId: string, id: string, dto: UpdateCampaignDto) {
    await this.findOne(organizationId, id);

    const { name, description, icpId, sequenceId, type, settings } = dto;

    if (icpId) await this.verifyIcpOwnership(organizationId, icpId);
    if (sequenceId)
      await this.verifySequenceOwnership(organizationId, sequenceId);

    return this.prisma.campaign.update({
      where: { id },
      data: { name, description, icpId, sequenceId, type, settings },
      include: { icp: true, sequence: true },
    });
  }

  /**
   * Updates campaign status after verifying ownership.
   */
  async updateStatus(
    organizationId: string,
    id: string,
    status: CampaignStatus,
  ) {
    await this.findOne(organizationId, id);
    return this.prisma.campaign.update({ where: { id }, data: { status } });
  }

  /**
   * Deletes a campaign after verifying ownership.
   */
  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    await this.prisma.campaign.delete({ where: { id } });
    return { id, deleted: true };
  }

  private async verifyIcpOwnership(
    organizationId: string,
    icpId: string,
  ): Promise<void> {
    const icp = await this.prisma.iCP.findFirst({
      where: { id: icpId, organizationId },
    });
    if (!icp) throw new NotFoundException(`ICP ${icpId} not found`);
  }

  private async verifySequenceOwnership(
    organizationId: string,
    sequenceId: string,
  ): Promise<void> {
    const sequence = await this.prisma.sequence.findFirst({
      where: { id: sequenceId, organizationId },
    });
    if (!sequence)
      throw new NotFoundException(`Sequence ${sequenceId} not found`);
  }
}
