import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PrismaModule} from './prisma/prisma.module'
import { OrganizationsModule } from './organizations/organizations.module';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [PrismaModule, OrganizationsModule, CompaniesModule, ContactsModule, LeadsModule, CampaignsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
