import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../prisma/prisma.service';

const ORG_A = 'org-aaaa-0001';
const ORG_B = 'org-bbbb-0002';
const USER_ID = 'user-0001';
const ACTIVITY_ID = 'act-0001';
const LEAD_ID = 'lead-0001';
const CONTACT_ID = 'contact-0001';
const COMPANY_ID = 'company-0001';
const CAMPAIGN_ID = 'campaign-0001';

const mockActivity = {
  id: ACTIVITY_ID,
  organizationId: ORG_A,
  type: 'EMAIL',
  title: 'Sent intro email',
  description: 'Initial outreach',
  metadata: null,
  userId: USER_ID,
  leadId: LEAD_ID,
  contactId: null,
  companyId: null,
  campaignId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    id: USER_ID,
    firstName: 'Adi',
    lastName: 'Singh',
    avatar: null,
    email: 'adi@test.com',
  },
  lead: { id: LEAD_ID, status: 'NEW' },
  contact: null,
  company: null,
  campaign: null,
};

type MockPrisma = {
  activity: {
    findMany: jest.Mock;
    count: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  lead: { findFirst: jest.Mock };
  contact: { findFirst: jest.Mock };
  company: { findFirst: jest.Mock };
  campaign: { findFirst: jest.Mock };
};

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let prisma: MockPrisma;

  beforeEach(async () => {
    prisma = {
      activity: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      lead: { findFirst: jest.fn() },
      contact: { findFirst: jest.fn() },
      company: { findFirst: jest.fn() },
      campaign: { findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  // ─── LIST ──────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns only activities belonging to the authenticated organization', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);
      prisma.activity.count.mockResolvedValue(1);

      const result = await service.findAll(ORG_A);

      expect(result.items).toEqual([mockActivity]);
      expect(prisma.activity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: ORG_A }),
        }),
      );
    });

    it('org B gets its own scoped empty list', async () => {
      prisma.activity.findMany.mockResolvedValue([]);
      prisma.activity.count.mockResolvedValue(0);

      const result = await service.findAll(ORG_B);

      expect(result.items).toEqual([]);
    });

    it('applies leadId filter within org scope', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);
      prisma.activity.count.mockResolvedValue(1);

      await service.findAll(ORG_A, { leadId: LEAD_ID });

      expect(prisma.activity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: ORG_A,
            leadId: LEAD_ID,
          }),
        }),
      );
    });

    it('applies search filter within org scope', async () => {
      prisma.activity.findMany.mockResolvedValue([]);
      prisma.activity.count.mockResolvedValue(0);

      await service.findAll(ORG_A, { search: 'intro' });

      expect(prisma.activity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'intro', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('returns paginated meta', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);
      prisma.activity.count.mockResolvedValue(25);

      const result = await service.findAll(ORG_A, { page: 2, limit: 10 });

      expect(result.meta.total).toBe(25);
      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(3);
    });
  });

  // ─── GET ONE ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns activity when it belongs to the authenticated organization', async () => {
      prisma.activity.findFirst.mockResolvedValue(mockActivity);

      const result = await service.findOne(ORG_A, ACTIVITY_ID);

      expect(result).toEqual(mockActivity);
      expect(prisma.activity.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ACTIVITY_ID, organizationId: ORG_A },
        }),
      );
    });

    it('throws NotFoundException when activity does not exist', async () => {
      prisma.activity.findFirst.mockResolvedValue(null);

      await expect(service.findOne(ORG_A, 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException for cross-tenant access — never reveals existence', async () => {
      prisma.activity.findFirst.mockResolvedValue(null);

      await expect(service.findOne(ORG_B, ACTIVITY_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── CREATE ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates an activity scoped to the authenticated organization', async () => {
      prisma.lead.findFirst.mockResolvedValue({
        id: LEAD_ID,
        organizationId: ORG_A,
      });
      prisma.activity.create.mockResolvedValue(mockActivity);

      const result = await service.create(ORG_A, USER_ID, {
        type: 'EMAIL',
        title: 'Sent intro email',
        leadId: LEAD_ID,
      });

      expect(result).toEqual(mockActivity);
      expect(prisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ organizationId: ORG_A }),
        }),
      );
    });

    it('verifies leadId belongs to same org before creating', async () => {
      prisma.lead.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, USER_ID, {
          type: 'EMAIL',
          title: 'Test',
          leadId: LEAD_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.activity.create).not.toHaveBeenCalled();
    });

    it('verifies contactId belongs to same org before creating', async () => {
      prisma.contact.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, USER_ID, {
          type: 'CALL',
          title: 'Call',
          contactId: CONTACT_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.activity.create).not.toHaveBeenCalled();
    });

    it('verifies companyId belongs to same org before creating', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, USER_ID, {
          type: 'MEETING',
          title: 'Meeting',
          companyId: COMPANY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.activity.create).not.toHaveBeenCalled();
    });

    it('verifies campaignId belongs to same org before creating', async () => {
      prisma.campaign.findFirst.mockResolvedValue(null);

      await expect(
        service.create(ORG_A, USER_ID, {
          type: 'CAMPAIGN',
          title: 'Campaign',
          campaignId: CAMPAIGN_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.activity.create).not.toHaveBeenCalled();
    });

    it('skips relation checks when optional ids are not provided', async () => {
      prisma.activity.create.mockResolvedValue(mockActivity);

      await service.create(ORG_A, USER_ID, {
        type: 'NOTE',
        title: 'General note',
      });

      expect(prisma.lead.findFirst).not.toHaveBeenCalled();
      expect(prisma.contact.findFirst).not.toHaveBeenCalled();
      expect(prisma.company.findFirst).not.toHaveBeenCalled();
      expect(prisma.campaign.findFirst).not.toHaveBeenCalled();
    });
  });

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates activity that belongs to authenticated organization', async () => {
      const updated = { ...mockActivity, title: 'Updated title' };
      prisma.activity.findFirst.mockResolvedValue(mockActivity);
      prisma.activity.update.mockResolvedValue(updated);

      const result = await service.update(ORG_A, ACTIVITY_ID, {
        title: 'Updated title',
      });

      expect(result).toEqual(updated);
      expect(prisma.activity.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: ACTIVITY_ID } }),
      );
    });

    it('throws NotFoundException and never mutates on cross-tenant update', async () => {
      prisma.activity.findFirst.mockResolvedValue(null);

      await expect(
        service.update(ORG_B, ACTIVITY_ID, { title: 'Hijacked' }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.activity.update).not.toHaveBeenCalled();
    });
  });

  // ─── DELETE ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes activity that belongs to authenticated organization', async () => {
      prisma.activity.findFirst.mockResolvedValue(mockActivity);
      prisma.activity.delete.mockResolvedValue(mockActivity);

      const result = await service.remove(ORG_A, ACTIVITY_ID);

      expect(result).toEqual({ id: ACTIVITY_ID, deleted: true });
      expect(prisma.activity.delete).toHaveBeenCalledWith({
        where: { id: ACTIVITY_ID },
      });
    });

    it('throws NotFoundException and never deletes on cross-tenant attempt', async () => {
      prisma.activity.findFirst.mockResolvedValue(null);

      await expect(service.remove(ORG_B, ACTIVITY_ID)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.activity.delete).not.toHaveBeenCalled();
    });
  });
});
