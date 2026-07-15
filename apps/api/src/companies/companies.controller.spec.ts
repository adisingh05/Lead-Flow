import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AuthenticatedOrganization } from '../auth/auth.types';
import { UserRole } from '@prisma/client';

const organization: AuthenticatedOrganization = {
  id: 'org_a',
  clerkId: 'clerk_org_a',
  name: 'Org A',
  slug: 'org-a',
  role: UserRole.ADMIN,
};

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: jest.Mocked<CompaniesService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<CompaniesService>;

    controller = new CompaniesController(service);
  });

  it('findAll passes organizationId from AuthContext, not query params', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([]);

    await controller.findAll(organization);

    expect(service.findAll).toHaveBeenCalledWith('org_a');
  });

  it('findOne passes organizationId from AuthContext', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({});

    await controller.findOne('company_1', organization);

    expect(service.findOne).toHaveBeenCalledWith('company_1', 'org_a');
  });

  it('create passes organizationId from AuthContext, not from body', async () => {
    (service.create as jest.Mock).mockResolvedValue({});
    const dto = { name: 'New Corp' };

    await controller.create(organization, dto);

    expect(service.create).toHaveBeenCalledWith('org_a', dto);
  });

  it('update passes organizationId from AuthContext', async () => {
    (service.update as jest.Mock).mockResolvedValue({});
    const dto = { name: 'Updated Corp' };

    await controller.update('company_1', organization, dto);

    expect(service.update).toHaveBeenCalledWith('company_1', 'org_a', dto);
  });

  it('remove passes organizationId from AuthContext', async () => {
    (service.remove as jest.Mock).mockResolvedValue({});

    await controller.remove('company_1', organization);

    expect(service.remove).toHaveBeenCalledWith('company_1', 'org_a');
  });
});
