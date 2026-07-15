import { NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';

const ORG_A = 'org_a';
const ORG_B = 'org_b';

const companyA = {
  id: 'company_1',
  name: 'Acme Corp',
  organizationId: ORG_A,
  domain: null,
  website: null,
  industry: null,
  size: null,
  revenue: null,
  country: null,
  city: null,
  description: null,
  linkedin: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      company: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    service = new CompaniesService(prisma);
  });

  describe('findAll', () => {
    it('returns only companies belonging to the authenticated organization', async () => {
      (prisma.company.findMany as jest.Mock).mockResolvedValue([companyA]);

      const result = await service.findAll(ORG_A);

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: { organizationId: ORG_A },
      });
      expect(result).toEqual([companyA]);
    });
  });

  describe('findOne', () => {
    it('returns a company belonging to the authenticated organization', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(companyA);

      const result = await service.findOne('company_1', ORG_A);

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: 'company_1', organizationId: ORG_A },
      });
      expect(result).toEqual(companyA);
    });

    it('throws NotFoundException for a company belonging to another organization', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('company_1', ORG_B)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: 'company_1', organizationId: ORG_B },
      });
    });
  });

  describe('create', () => {
    it('assigns organizationId from AuthContext, not from client input', async () => {
      const dto = { name: 'New Corp' };
      const created = { ...companyA, name: 'New Corp' };
      (prisma.company.create as jest.Mock).mockResolvedValue(created);

      const result = await service.create(ORG_A, dto);

      expect(prisma.company.create).toHaveBeenCalledWith({
        data: {
          name: 'New Corp',
          domain: undefined,
          website: undefined,
          industry: undefined,
          organizationId: ORG_A,
        },
      });
      expect(result.organizationId).toBe(ORG_A);
    });

    it('does not allow client to set organizationId', async () => {
      const dto = { name: 'New Corp' };
      (prisma.company.create as jest.Mock).mockResolvedValue({
        ...companyA,
        organizationId: ORG_A,
      });

      await service.create(ORG_A, dto);

      const callArg = (prisma.company.create as jest.Mock).mock.calls[0][0] as {
        data: { organizationId: string };
      };
      expect(callArg.data.organizationId).toBe(ORG_A);
    });
  });

  describe('update', () => {
    it('updates a company belonging to the authenticated organization', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(companyA);
      (prisma.company.update as jest.Mock).mockResolvedValue({
        ...companyA,
        name: 'Updated Corp',
      });

      const result = await service.update('company_1', ORG_A, {
        name: 'Updated Corp',
      });

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: 'company_1', organizationId: ORG_A },
      });
      expect(result.name).toBe('Updated Corp');
    });

    it('throws NotFoundException when updating another organization company', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('company_1', ORG_B, { name: 'Hack' }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.company.update).not.toHaveBeenCalled();
    });

    it('does not change organizationId through update payload', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(companyA);
      (prisma.company.update as jest.Mock).mockResolvedValue(companyA);

      await service.update('company_1', ORG_A, { name: 'Safe Update' });

      const callArg = (prisma.company.update as jest.Mock).mock.calls[0][0] as {
        data: Record<string, unknown>;
      };
      expect(callArg.data).not.toHaveProperty('organizationId');
    });
  });

  describe('remove', () => {
    it('deletes a company belonging to the authenticated organization', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(companyA);
      (prisma.company.delete as jest.Mock).mockResolvedValue(companyA);

      await service.remove('company_1', ORG_A);

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: 'company_1', organizationId: ORG_A },
      });
      expect(prisma.company.delete).toHaveBeenCalledWith({
        where: { id: 'company_1' },
      });
    });

    it('throws NotFoundException when deleting another organization company', async () => {
      (prisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('company_1', ORG_B)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.company.delete).not.toHaveBeenCalled();
    });
  });
});
