import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { SequenceService } from "./sequence.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateSequenceDto } from "../dto/crm.dto";

@Controller("sequences")
@UseGuards(ClerkAuthGuard)
export class SequenceController {
  constructor(private readonly sequenceService: SequenceService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUserContext,
    @Body() input: CreateSequenceDto,
  ) {
    return this.sequenceService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.sequenceService.findAll(user.organizationId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.sequenceService.findOne(user.organizationId, id);
  }
}
