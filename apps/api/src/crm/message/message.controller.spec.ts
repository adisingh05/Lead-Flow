import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("MessageController (Integration)", () => {
  let app: INestApplication;
  let messageService: MessageService;
  let prismaService: PrismaService;
  const mockUser = { organizationId: "org-1", id: "user-1", role: "MEMBER" };

  beforeEach(async () => {
    const mockPrismaService = {
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirstOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    messageService = module.get<MessageService>(MessageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe("Message CRUD Operations", () => {
    it("should create a message", async () => {
      const createDto = {
        leadId: "lead-1",
        direction: "OUTBOUND",
        channel: "EMAIL",
        subject: "Test Subject",
        body: "Test body",
      };

      const mockMessage = {
        id: "msg-1",
        organizationId: "org-1",
        ...createDto,
        status: "DRAFT",
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.message, "create")
        .mockResolvedValue(mockMessage as any);

      const result = await messageService.create(
        mockUser.organizationId,
        createDto as any,
      );
      expect(result).toEqual(mockMessage);
      expect(prismaService.message.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          organizationId: mockUser.organizationId,
        },
      });
    });

    it("should list messages for organization", async () => {
      const mockMessages = [
        {
          id: "msg-1",
          organizationId: "org-1",
          leadId: "lead-1",
          status: "SENT",
        },
        {
          id: "msg-2",
          organizationId: "org-1",
          leadId: "lead-2",
          status: "DRAFT",
        },
      ];

      jest
        .spyOn(prismaService.message, "findMany")
        .mockResolvedValue(mockMessages as any);

      const result = await messageService.findAll(mockUser.organizationId);
      expect(result).toEqual(mockMessages);
      expect(prismaService.message.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockUser.organizationId },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter messages by leadId", async () => {
      const mockMessages = [
        {
          id: "msg-1",
          organizationId: "org-1",
          leadId: "lead-1",
          status: "SENT",
        },
      ];

      jest
        .spyOn(prismaService.message, "findMany")
        .mockResolvedValue(mockMessages as any);

      const result = await messageService.findAll(
        mockUser.organizationId,
        "lead-1",
      );
      expect(result).toEqual(mockMessages);
      expect(prismaService.message.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockUser.organizationId, leadId: "lead-1" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should get a single message", async () => {
      const mockMessage = {
        id: "msg-1",
        organizationId: "org-1",
        leadId: "lead-1",
        status: "SENT",
        body: "Test",
      };

      jest
        .spyOn(prismaService.message, "findFirstOrThrow")
        .mockResolvedValue(mockMessage as any);

      const result = await messageService.findOne(
        mockUser.organizationId,
        "msg-1",
      );
      expect(result).toEqual(mockMessage);
      expect(prismaService.message.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: "msg-1", organizationId: mockUser.organizationId },
      });
    });

    it("should update message status", async () => {
      const mockMessage = {
        id: "msg-1",
        organizationId: "org-1",
        status: "SENT",
      };

      jest
        .spyOn(prismaService.message, "update")
        .mockResolvedValue(mockMessage as any);

      const result = await messageService.updateStatus(
        mockUser.organizationId,
        "msg-1",
        "SENT" as any,
      );
      expect(result).toEqual(mockMessage);
      expect(prismaService.message.update).toHaveBeenCalledWith({
        where: { id: "msg-1", organizationId: mockUser.organizationId },
        data: { status: "SENT" },
      });
    });

    it("should delete a message", async () => {
      const mockMessage = { id: "msg-1", organizationId: "org-1" };

      jest
        .spyOn(prismaService.message, "delete")
        .mockResolvedValue(mockMessage as any);

      const result = await messageService.delete(
        mockUser.organizationId,
        "msg-1",
      );
      expect(result).toEqual(mockMessage);
      expect(prismaService.message.delete).toHaveBeenCalledWith({
        where: { id: "msg-1", organizationId: mockUser.organizationId },
      });
    });
  });

  describe("Tenant Isolation", () => {
    it("should only access messages within the same organization", async () => {
      const differentOrgId = "org-2";
      const mockMessage = {
        id: "msg-1",
        organizationId: "org-1",
        leadId: "lead-1",
      };

      jest
        .spyOn(prismaService.message, "findFirstOrThrow")
        .mockResolvedValue(mockMessage as any);

      // Attempting to access a message from a different org
      const result = await messageService.findOne(
        mockUser.organizationId,
        "msg-1",
      );

      // Verify the query included the organizationId filter
      expect(prismaService.message.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: "msg-1",
          organizationId: mockUser.organizationId,
        },
      });
    });

    it("should not allow users to see messages from other organizations", async () => {
      const anotherOrgId = "org-2";

      jest.spyOn(prismaService.message, "findMany").mockResolvedValue([]);

      // User from org-1 should not see messages from org-2
      const result = await messageService.findAll(mockUser.organizationId);

      expect(prismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: mockUser.organizationId,
          }),
        }),
      );
    });
  });
});
