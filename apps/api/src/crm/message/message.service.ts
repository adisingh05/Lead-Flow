import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMessageInput, MessageStatus } from "@leadflow/types";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, input: CreateMessageInput) {
    return this.prisma.message.create({
      data: {
        ...input,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string, leadId?: string) {
    return this.prisma.message.findMany({
      where: {
        organizationId,
        ...(leadId ? { leadId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(organizationId: string, id: string) {
    return this.prisma.message.findFirstOrThrow({
      where: { id, organizationId },
    });
  }

  async updateStatus(
    organizationId: string,
    id: string,
    status: MessageStatus,
  ) {
    return this.prisma.message.update({
      where: { id, organizationId },
      data: { status },
    });
  }

  async delete(organizationId: string, id: string) {
    return this.prisma.message.delete({
      where: { id, organizationId },
    });
  }
}
