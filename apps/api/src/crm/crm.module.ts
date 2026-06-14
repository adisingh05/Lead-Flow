import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { LeadModule } from './lead/lead.module';
import { CampaignModule } from './campaign/campaign.module';
import { IcpModule } from './icp/icp.module';
import { SequenceModule } from './sequence/sequence.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    CompanyModule,
    ContactModule,
    LeadModule,
    CampaignModule,
    IcpModule,
    SequenceModule,
    ActivityModule,
  ],
  exports: [
    CompanyModule,
    ContactModule,
    LeadModule,
    CampaignModule,
    IcpModule,
    SequenceModule,
    ActivityModule,
  ],
})
export class CrmModule {}
