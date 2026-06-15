import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { IcpService } from "./icp.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateIcpDto } from "../dto/crm.dto";

@Controller("icps")
@UseGuards(ClerkAuthGuard)
export class IcpController {
  constructor(private readonly icpService: IcpService) {}

  @Post()
  create(@CurrentUser() user: AuthUserContext, @Body() input: CreateIcpDto) {
    return this.icpService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.icpService.findAll(user.organizationId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.icpService.findOne(user.organizationId, id);
  }
}
