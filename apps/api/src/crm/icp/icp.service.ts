import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIcpInput } from '@leadflow/types';

@Injectable()
export class IcpService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateIcpInput) {
    return this.prisma.iCP.create({
      data: {
        name: input.name,
        industries: input.industries ? input.industries : undefined,
        employeeMin: input.employeeMin,
        employeeMax: input.employeeMax,
        countries: input.countries ? input.countries : undefined,
        buyerTitles: input.buyerTitles ? input.buyerTitles : undefined,
        technologies: input.technologies ? input.technologies : undefined,
        keywords: input.keywords ? input.keywords : undefined,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.iCP.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.iCP.findFirstOrThrow({
      where: { id, organizationId },
    });
  }
}
