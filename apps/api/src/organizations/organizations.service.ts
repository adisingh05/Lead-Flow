import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async create(data: { name: string; slug: string }) {
    return this.prisma.organization.create({ data });
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.organization.delete({ where: { id } });
  }
}
