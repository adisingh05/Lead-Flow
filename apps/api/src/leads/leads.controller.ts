import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@Query('organizationId') organizationId: string) {
    return this.leadsService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  create(@Body() body: { organizationId: string }) {
    return this.leadsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { status?: string; score?: number },
  ) {
    return this.leadsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
