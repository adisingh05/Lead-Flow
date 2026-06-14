import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactInput } from '@leadflow/types';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateContactInput) {
    return this.prisma.contact.create({
      data: {
        ...input,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string, companyId?: string) {
    return this.prisma.contact.findMany({
      where: {
        organizationId,
        ...(companyId ? { companyId } : {}),
      },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.contact.findFirstOrThrow({
      where: { id, organizationId },
      include: { company: true },
    });
  }
}
