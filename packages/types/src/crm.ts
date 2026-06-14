// Enums matching the Prisma schema to avoid frontend-backend coupling
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum LeadSource {
  APOLLO = 'APOLLO',
  LINKEDIN = 'LINKEDIN',
  CRUNCHBASE = 'CRUNCHBASE',
  WEBSITE = 'WEBSITE',
  MANUAL = 'MANUAL',
  IMPORT = 'IMPORT',
  AGENT = 'AGENT'
}

export enum LeadStatus {
  NEW = 'NEW',
  RESEARCHING = 'RESEARCHING',
  RESEARCHED = 'RESEARCHED',
  ENRICHED = 'ENRICHED',
  CONTACTED = 'CONTACTED',
  RESPONDED = 'RESPONDED',
  BOUNCED = 'BOUNCED',
  CONVERTED = 'CONVERTED',
  NURTURING = 'NURTURING',
  DISQUALIFIED = 'DISQUALIFIED'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum CampaignType {
  EMAIL = 'EMAIL',
  LINKEDIN = 'LINKEDIN',
  MULTICHANNEL = 'MULTICHANNEL'
}

export enum MessageDirection {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

export enum MessageChannel {
  EMAIL = 'EMAIL',
  LINKEDIN = 'LINKEDIN'
}

export enum MessageStatus {
  DRAFT = 'DRAFT',
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  BOUNCED = 'BOUNCED',
  FAILED = 'FAILED'
}

export enum ActorType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  RESEARCH_AGENT = 'RESEARCH_AGENT',
  SALES_AGENT = 'SALES_AGENT',
  CONTENT_AGENT = 'CONTENT_AGENT',
  REVIEW_AGENT = 'REVIEW_AGENT',
  ORCHESTRATOR = 'ORCHESTRATOR'
}

// Interfaces (DTOs)
export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDto {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDto {
  id: string;
  organizationId: string;
  name: string;
  domain?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactDto {
  id: string;
  organizationId: string;
  companyId?: string | null;
  company?: CompanyDto | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  linkedinUrl?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDto {
  id: string;
  organizationId: string;
  contactId: string;
  contact?: ContactDto | null;
  companyId: string;
  company?: CompanyDto | null;
  campaignId?: string | null;
  icpId?: string | null;
  status: LeadStatus;
  score?: number | null;
  source?: LeadSource | null;
  sourceMetadata?: Record<string, any> | null;
  enrichmentData?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface IcpDto {
  id: string;
  organizationId: string;
  name: string;
  industries?: any | null; // JSON
  employeeMin?: number | null;
  employeeMax?: number | null;
  countries?: any | null; // JSON
  buyerTitles?: any | null; // JSON
  technologies?: any | null; // JSON
  keywords?: any | null; // JSON
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStepDto {
  id: string;
  sequenceId: string;
  stepNumber: number;
  type: MessageChannel;
  delayDays: number;
  templateSubject?: string | null;
  templateBody: string;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceDto {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  steps?: SequenceStepDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDto {
  id: string;
  organizationId: string;
  icpId?: string | null;
  sequenceId?: string | null;
  name: string;
  description?: string | null;
  status: CampaignStatus;
  type: CampaignType;
  settings?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDto {
  id: string;
  organizationId: string;
  campaignId?: string | null;
  leadId: string;
  direction: MessageDirection;
  channel: MessageChannel;
  subject?: string | null;
  body: string;
  status: MessageStatus;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDto {
  id: string;
  organizationId: string;
  userId?: string | null;
  leadId?: string | null;
  actorType: ActorType;
  type: string;
  description: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface AgentRunDto {
  id: string;
  organizationId: string;
  agentType: ActorType;
  status: string;
  duration?: number | null;
  tokensUsed?: number | null;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentTaskDto {
  id: string;
  agentRunId?: string | null;
  payload: Record<string, any>;
  status: string;
  assignedAgent: ActorType;
  resultSummary?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Input creation interfaces
export interface CreateOrgInput {
  name: string;
  slug: string;
}

export interface CreateCompanyInput {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  description?: string;
}

export interface CreateContactInput {
  companyId?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  location?: string;
}

export interface CreateLeadInput {
  contactId: string;
  companyId: string;
  campaignId?: string;
  icpId?: string;
  status?: LeadStatus;
  source?: LeadSource;
  sourceMetadata?: Record<string, any>;
}

export interface CreateIcpInput {
  name: string;
  industries?: string[];
  employeeMin?: number;
  employeeMax?: number;
  countries?: string[];
  buyerTitles?: string[];
  technologies?: string[];
  keywords?: string[];
}

export interface CreateSequenceStepInput {
  stepNumber: number;
  type: MessageChannel;
  delayDays: number;
  templateSubject?: string;
  templateBody: string;
}

export interface CreateSequenceInput {
  name: string;
  description?: string;
  steps?: CreateSequenceStepInput[];
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  icpId?: string;
  sequenceId?: string;
  type: CampaignType;
  settings?: Record<string, any>;
}

export interface CreateMessageInput {
  campaignId?: string;
  leadId: string;
  direction: MessageDirection;
  channel: MessageChannel;
  subject?: string;
  body: string;
  status?: MessageStatus;
}
