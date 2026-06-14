import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyInput } from '@leadflow/types';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateCompanyInput) {
    return this.prisma.company.create({
      data: {
        ...input,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.company.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.company.findFirstOrThrow({
      where: { id, organizationId },
    });
  }
}
