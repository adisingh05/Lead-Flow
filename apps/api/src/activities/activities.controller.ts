import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';

@ApiTags('activities')
@UseGuards(ClerkAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(
    @Query('organizationId') organizationId: string,
    @Query('leadId') leadId?: string,
    @Query('contactId') contactId?: string,
  ) {
    return this.activitiesService.findAll(organizationId, leadId, contactId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
