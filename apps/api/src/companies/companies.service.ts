import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.company.findMany({
      where: { organizationId },
    });
  }

  async findOne(id: string, organizationId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, organizationId },
    });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return company;
  }

  async create(organizationId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        domain: dto.domain,
        website: dto.website,
        industry: dto.industry,
        organizationId,
      },
    });
  }

  async update(id: string, organizationId: string, dto: UpdateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: { id, organizationId },
    });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return this.prisma.company.update({
      where: { id: company.id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, organizationId },
    });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return this.prisma.company.delete({
      where: { id: company.id },
    });
  }
}
