import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateContactDto } from "../dto/crm.dto";

@Controller("contacts")
@UseGuards(ClerkAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUserContext,
    @Body() input: CreateContactDto,
  ) {
    return this.contactService.create(user.organizationId, input);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query("companyId") companyId?: string,
  ) {
    return this.contactService.findAll(user.organizationId, companyId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.contactService.findOne(user.organizationId, id);
  }
}
