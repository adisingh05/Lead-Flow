import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.company.findMany({ where: { organizationId } });
  }

  async findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async create(data: { name: string; organizationId: string }) {
    return this.prisma.company.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; website?: string; industry?: string },
  ) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}
