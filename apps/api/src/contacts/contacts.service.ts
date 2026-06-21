import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.contact.findMany({ where: { organizationId } });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    organizationId: string;
  }) {
    return this.prisma.contact.create({ data });
  }

  async update(
    id: string,
    data: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.prisma.contact.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }
}
