import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CrmModule } from './crm/crm.module';
import { AgentsModule } from './agents/agents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ResearchModule } from './research/research.module';
import { SalesModule } from './sales/sales.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CrmModule,
    AgentsModule,
    AnalyticsModule,
    ResearchModule,
    SalesModule,
    ContentModule,
  ],
})
export class AppModule {}
