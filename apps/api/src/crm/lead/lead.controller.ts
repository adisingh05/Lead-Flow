import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { LeadService } from "./lead.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext, LeadStatus } from "@leadflow/types";
import { CreateLeadDto, UpdateLeadStatusDto } from "../dto/crm.dto";

@Controller("leads")
@UseGuards(ClerkAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@CurrentUser() user: AuthUserContext, @Body() input: CreateLeadDto) {
    return this.leadService.create(user.organizationId, user.id, input);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query("campaignId") campaignId?: string,
    @Query("status") status?: LeadStatus,
    @Query("icpId") icpId?: string,
  ) {
    return this.leadService.findAll(
      user.organizationId,
      campaignId,
      status,
      icpId,
    );
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.leadService.findOne(user.organizationId, id);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() input: UpdateLeadStatusDto,
  ) {
    return this.leadService.updateStatus(
      user.organizationId,
      user.id,
      id,
      input.status,
    );
  }
}
