import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { Patch } from "@nestjs/common";
import { MessageService } from "./message.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateMessageInput, MessageStatus } from "@leadflow/types";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Messages")
@ApiBearerAuth()
@Controller("messages")
@UseGuards(ClerkAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: "Create a message" })
  @ApiResponse({ status: 201, description: "Message created" })
  create(
    @CurrentUser() user: AuthUserContext,
    @Body() input: CreateMessageInput,
  ) {
    return this.messageService.create(user.organizationId, input);
  }

  @Get()
  @ApiOperation({ summary: "List messages for organization" })
  @ApiResponse({ status: 200, description: "List of messages" })
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query("leadId") leadId?: string,
  ) {
    return this.messageService.findAll(user.organizationId, leadId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single message" })
  @ApiResponse({ status: 200, description: "Message details" })
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.messageService.findOne(user.organizationId, id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update message status" })
  @ApiResponse({ status: 200, description: "Status updated" })
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: { status: MessageStatus },
  ) {
    return this.messageService.updateStatus(
      user.organizationId,
      id,
      body.status,
    );
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.messageService.delete(user.organizationId, id);
  }
}
