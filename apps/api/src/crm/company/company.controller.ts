import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard";
import { CurrentUser } from "../../auth/current-user.decorator";
import { AuthUserContext } from "@leadflow/types";
import { CreateCompanyDto } from "../dto/crm.dto";

@Controller("companies")
@UseGuards(ClerkAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUserContext,
    @Body() input: CreateCompanyDto,
  ) {
    return this.companyService.create(user.organizationId, input);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.companyService.findAll(user.organizationId);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: AuthUserContext,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.companyService.findOne(user.organizationId, id);
  }
}
