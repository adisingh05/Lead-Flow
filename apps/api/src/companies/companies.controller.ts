import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentOrganization } from '../auth/current-organization.decorator';
import type { AuthenticatedOrganization } from '../auth/auth.types';

@ApiTags('companies')
@UseGuards(ClerkAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(@CurrentOrganization() organization: AuthenticatedOrganization) {
    return this.companiesService.findAll(organization.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentOrganization() organization: AuthenticatedOrganization,
  ) {
    return this.companiesService.findOne(id, organization.id);
  }

  @Post()
  create(
    @CurrentOrganization() organization: AuthenticatedOrganization,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companiesService.create(organization.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentOrganization() organization: AuthenticatedOrganization,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, organization.id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentOrganization() organization: AuthenticatedOrganization,
  ) {
    return this.companiesService.remove(id, organization.id);
  }
}
