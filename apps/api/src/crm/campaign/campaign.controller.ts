import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateCampaignDto, UpdateCampaignStatusDto } from "../dto/crm.dto";

@Controller("campaigns")
@UseGuards(ClerkAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUserContext,
    @Body() input: CreateCampaignDto,
  ) {
    return this.campaignService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.campaignService.findAll(user.organizationId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.campaignService.findOne(user.organizationId, id);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() input: UpdateCampaignStatusDto,
  ) {
    return this.campaignService.updateStatus(
      user.organizationId,
      id,
      input.status,
    );
  }
}
