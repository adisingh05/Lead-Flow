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
import { ContactsService } from './contacts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@Query('organizationId') organizationId: string) {
    return this.contactsService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      organizationId: string;
    },
  ) {
    return this.contactsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.contactsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
