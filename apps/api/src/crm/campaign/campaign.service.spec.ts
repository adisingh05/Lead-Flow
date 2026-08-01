import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { PrismaService } from '../../prisma/prisma.service';

const ORG_A = 'aaa00000-0000-4000-8000-000000000001';
const ORG_B = 'bbb00000-0000-4000-8000-000000000002';

const CAMPAIGN_ID = 'ccc00000-0000-4000-8000-000000000003';
const ICP_ID = 'ddd00000-0000-4000-8000-000000000004';
const SEQUENCE_ID = 'eee00000-0000-4000-8000-000000000005';
const FOREIGN_ICP_ID = 'fff00000-0000-4000-8000-000000000006';
const FOREIGN_SEQUENCE_ID = '111aaaaa-0000-4000-8000-000000000007';

const mockIcp = { id: ICP_ID, organizationId: ORG_A, name: 'ICP v1' };
const mockSequence = {
  id: SEQUENCE_ID,
  organizationId: ORG_A,
  name: 'Welcome Seq',
};

const mockCampaign = {
  id: CAMPAIGN_ID,
  organizationId: ORG_A,
  name: 'Q1 Outreach',
  description: null,
  icpId: null,
  sequenceId: null,
  status: 'DRAFT',
  type: 'EMAIL',
  settings: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  icp: null,
  sequence: null,
  leads: [],
};

type MockPrisma = {
  campaign: {
    findMany: jest.Mock;
    count: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  iCP: { findFirst: jest.Mock };
  sequence: { findFirst: jest.Mock };
  lead: { groupBy: jest.Mock };
};

describe('CampaignService', () => {
  let service: CampaignService;
  let prisma: MockPrisma;

  beforeEach(async () => {
    prisma = {
      campaign: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      iCP: { findFirst: jest.fn() },
      sequence: { findFirst: jest.fn() },
      lead: { groupBy: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  // ─── LIST ──────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns only campaigns belonging to the authenticated organization', async () => {
      prisma.campaign.findMany.mockResolvedValue([mockCampaign]);
      prisma.campaign.count.mockResolvedValue(1);

      const result = await service.findAll(ORG_A);

      expect(result.items).toEqual([mockCampaign]);
      expect(prisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: ORG_A }),
        }),
      );
    });

    it('org B gets its own scoped empty list', async () => {
      prisma.campaign.findMany.mockResolvedValue([]);
      prisma.campaign.count.mockResolvedValue(0);

      const result = await service.findAll(ORG_B);

      expect(result.items).toEqual([]);
      expect(prisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: ORG_B }),
        }),
      );
    });
  });

  // ─── GET ───────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the campaign when it belongs to the authenticated organization', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);

      const result = await service.findOne(ORG_A, CAMPAIGN_ID);

      expect(result).toEqual(mockCampaign);
      expect(prisma.campaign.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: CAMPAIGN_ID, organizationId: ORG_A },
        }),
      );
    });

    it('throws NotFoundException when campaign does not exist', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(service.findOne(ORG_A, 'non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException for cross-tenant access — never reveals existence', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(service.findOne(ORG_B, CAMPAIGN_ID)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.campaign.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: CAMPAIGN_ID, organizationId: ORG_B },
        }),
      );
    });
  });

  // ─── CREATE ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates a campaign scoped to the authenticated organization', async () => {
      prisma.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(ORG_A, {
        name: 'Q1',
        type: 'EMAIL' as any,
      });

      expect(result).toEqual(mockCampaign);
      expect(prisma.campaign.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ organizationId: ORG_A }),
        }),
      );
    });

    it('organizationId always equals AuthContext org — cannot be spoofed', async () => {
      prisma.campaign.create.mockResolvedValue(mockCampaign);

      await service.create(ORG_A, { name: 'Spoof', type: 'EMAIL' as any });

      const callArg = prisma.campaign.create.mock.calls[0][0] as {
        data: { organizationId: string };
      };
      expect(callArg.data.organizationId).toBe(ORG_A);
      expect(callArg.data.organizationId).not.toBe(ORG_B);
    });

    it('verifies icpId belongs to same org before creating', async () => {
      prisma.iCP.findFirst.mockResolvedValue(mockIcp);
      prisma.campaign.create.mockResolvedValue({
        ...mockCampaign,
        icpId: ICP_ID,
      });

      await service.create(ORG_A, {
        name: 'Q1',
        type: 'EMAIL' as any,
        icpId: ICP_ID,
      });

      expect(prisma.iCP.findFirst).toHaveBeenCalledWith({
        where: { id: ICP_ID, organizationId: ORG_A },
      });
    });

    it('throws NotFoundException and does not create when icpId belongs to another org', async () => {
      prisma.iCP.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, {
          name: 'Q1',
          type: 'EMAIL' as any,
          icpId: FOREIGN_ICP_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.create).not.toHaveBeenCalled();
    });

    it('verifies sequenceId belongs to same org before creating', async () => {
      prisma.sequence.findFirst.mockResolvedValue(mockSequence);
      prisma.campaign.create.mockResolvedValue({
        ...mockCampaign,
        sequenceId: SEQUENCE_ID,
      });

      await service.create(ORG_A, {
        name: 'Q1',
        type: 'EMAIL' as any,
        sequenceId: SEQUENCE_ID,
      });

      expect(prisma.sequence.findFirst).toHaveBeenCalledWith({
        where: { id: SEQUENCE_ID, organizationId: ORG_A },
      });
    });

    it('throws NotFoundException and does not create when sequenceId belongs to another org', async () => {
      prisma.sequence.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, {
          name: 'Q1',
          type: 'EMAIL' as any,
          sequenceId: FOREIGN_SEQUENCE_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.create).not.toHaveBeenCalled();
    });

    it('skips ICP and sequence verification when neither is provided', async () => {
      prisma.campaign.create.mockResolvedValue(mockCampaign);

      await service.create(ORG_A, { name: 'Q1', type: 'EMAIL' as any });

      expect(prisma.iCP.findFirst).not.toHaveBeenCalled();
      expect(prisma.sequence.findFirst).not.toHaveBeenCalled();
    });
  });

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates a campaign that belongs to the authenticated organization', async () => {
      const updated = { ...mockCampaign, name: 'Q2 Outreach' };
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.campaign.update.mockResolvedValue(updated);

      const result = await service.update(ORG_A, CAMPAIGN_ID, {
        name: 'Q2 Outreach',
      });

      expect(result).toEqual(updated);
      expect(prisma.campaign.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: CAMPAIGN_ID } }),
      );
    });

    it('throws NotFoundException and never mutates on cross-tenant update', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(
        service.update(ORG_B, CAMPAIGN_ID, { name: 'Hijacked' }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.update).not.toHaveBeenCalled();
    });

    it('does not allow organizationId to be updated', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.campaign.update.mockResolvedValue(mockCampaign);

      await service.update(ORG_A, CAMPAIGN_ID, { name: 'Safe' });

      const callArg = prisma.campaign.update.mock.calls[0][0] as {
        data: Record<string, unknown>;
      };
      expect(callArg.data).not.toHaveProperty('organizationId');
    });

    it('validates updated icpId belongs to same org', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.iCP.findFirst.mockResolvedValue(mockIcp);
      prisma.campaign.update.mockResolvedValue(mockCampaign);

      await service.update(ORG_A, CAMPAIGN_ID, { icpId: ICP_ID });

      expect(prisma.iCP.findFirst).toHaveBeenCalledWith({
        where: { id: ICP_ID, organizationId: ORG_A },
      });
    });

    it('throws NotFoundException when updated icpId belongs to another org', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.iCP.findFirst.mockResolvedValue(null);

      await expect(
        service.update(ORG_A, CAMPAIGN_ID, { icpId: FOREIGN_ICP_ID }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.update).not.toHaveBeenCalled();
    });

    it('validates updated sequenceId belongs to same org', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.sequence.findFirst.mockResolvedValue(mockSequence);
      prisma.campaign.update.mockResolvedValue(mockCampaign);

      await service.update(ORG_A, CAMPAIGN_ID, { sequenceId: SEQUENCE_ID });

      expect(prisma.sequence.findFirst).toHaveBeenCalledWith({
        where: { id: SEQUENCE_ID, organizationId: ORG_A },
      });
    });

    it('throws NotFoundException when updated sequenceId belongs to another org', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.sequence.findFirst.mockResolvedValue(null);

      await expect(
        service.update(ORG_A, CAMPAIGN_ID, { sequenceId: FOREIGN_SEQUENCE_ID }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.update).not.toHaveBeenCalled();
    });
  });

  // ─── UPDATE STATUS ─────────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('updates status after verifying ownership', async () => {
      const updated = { ...mockCampaign, status: 'ACTIVE' };
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.campaign.update.mockResolvedValue(updated);

      const result = await service.updateStatus(
        ORG_A,
        CAMPAIGN_ID,
        'ACTIVE' as any,
      );

      expect(result).toEqual(updated);
      expect(prisma.campaign.update).toHaveBeenCalledWith({
        where: { id: CAMPAIGN_ID },
        data: { status: 'ACTIVE' },
      });
    });

    it('throws NotFoundException and never mutates on cross-tenant status update', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus(ORG_B, CAMPAIGN_ID, 'ACTIVE' as any),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.campaign.update).not.toHaveBeenCalled();
    });
  });

  // ─── DELETE ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes a campaign that belongs to the authenticated organization', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.campaign.delete.mockResolvedValue(mockCampaign);

      const result = await service.remove(ORG_A, CAMPAIGN_ID);

      expect(result).toEqual({ id: CAMPAIGN_ID, deleted: true });
      expect(prisma.campaign.delete).toHaveBeenCalledWith({
        where: { id: CAMPAIGN_ID },
      });
    });

    it('throws NotFoundException and never deletes on cross-tenant delete attempt', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(service.remove(ORG_B, CAMPAIGN_ID)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.campaign.delete).not.toHaveBeenCalled();
    });
  });

  // ─── Paginated findAll ──────────────────────────────────────────────────────

  describe('findAll (paginated)', () => {
    it('returns paginated campaigns scoped to the authenticated organization', async () => {
      prisma.campaign.findMany.mockResolvedValue([mockCampaign]);
      (prisma.campaign as any).count = jest.fn().mockResolvedValue(1);

      const result = await service.findAll(ORG_A, { page: 1, limit: 10 });

      expect(result.items).toEqual([mockCampaign]);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: ORG_A }),
          skip: 0,
          take: 10,
        }),
      );
    });

    it('applies search filter within the org scope', async () => {
      prisma.campaign.findMany.mockResolvedValue([mockCampaign]);
      (prisma.campaign as any).count = jest.fn().mockResolvedValue(1);

      await service.findAll(ORG_A, { search: 'Q1' });

      expect(prisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: ORG_A,
            OR: expect.arrayContaining([
              { name: { contains: 'Q1', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('applies status filter within the org scope', async () => {
      prisma.campaign.findMany.mockResolvedValue([]);
      (prisma.campaign as any).count = jest.fn().mockResolvedValue(0);

      await service.findAll(ORG_A, { status: 'ACTIVE' as any });

      expect(prisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: ORG_A,
            status: 'ACTIVE',
          }),
        }),
      );
    });
  });

  // ─── Metrics ───────────────────────────────────────────────────────────────

  describe('getMetrics', () => {
    it('returns zero metrics when campaign has no leads', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.lead.groupBy.mockResolvedValue([]);

      const result = await service.getMetrics(ORG_A, CAMPAIGN_ID);

      expect(result.totalLeads).toBe(0);
      expect(result.conversionRate).toBe(0);
      expect(result.replyRate).toBe(0);
      expect(result.completionPct).toBe(0);
    });

    it('throws NotFoundException for cross-tenant campaign metrics access', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(service.getMetrics(ORG_B, CAMPAIGN_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('calculates rates correctly from lead status distribution', async () => {
      prisma.campaign.findFirst.mockResolvedValue(mockCampaign);
      prisma.lead.groupBy.mockResolvedValue([
        { status: 'CONTACTED', _count: { id: 40 } },
        { status: 'RESPONDED', _count: { id: 20 } },
        { status: 'WON', _count: { id: 10 } },
        { status: 'LOST', _count: { id: 30 } },
      ]);

      const result = await service.getMetrics(ORG_A, CAMPAIGN_ID);

      expect(result.totalLeads).toBe(100);
      expect(result.contacted).toBe(40);
      expect(result.replied).toBe(20);
      expect(result.converted).toBe(10);
      expect(result.lost).toBe(30);
      expect(result.conversionRate).toBe(10);
      expect(result.replyRate).toBe(20);
      expect(result.completionPct).toBe(100);
    });
  });
});
