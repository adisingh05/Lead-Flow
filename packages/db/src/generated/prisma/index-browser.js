
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  clerkId: 'clerkId',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  organizationId: 'organizationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ICPScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  industries: 'industries',
  employeeMin: 'employeeMin',
  employeeMax: 'employeeMax',
  countries: 'countries',
  buyerTitles: 'buyerTitles',
  technologies: 'technologies',
  keywords: 'keywords',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  domain: 'domain',
  industry: 'industry',
  size: 'size',
  location: 'location',
  website: 'website',
  linkedinUrl: 'linkedinUrl',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  companyId: 'companyId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  jobTitle: 'jobTitle',
  linkedinUrl: 'linkedinUrl',
  location: 'location',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  contactId: 'contactId',
  companyId: 'companyId',
  campaignId: 'campaignId',
  icpId: 'icpId',
  status: 'status',
  score: 'score',
  source: 'source',
  sourceMetadata: 'sourceMetadata',
  enrichmentData: 'enrichmentData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SequenceScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SequenceStepScalarFieldEnum = {
  id: 'id',
  sequenceId: 'sequenceId',
  stepNumber: 'stepNumber',
  type: 'type',
  delayDays: 'delayDays',
  templateSubject: 'templateSubject',
  templateBody: 'templateBody',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  icpId: 'icpId',
  sequenceId: 'sequenceId',
  name: 'name',
  description: 'description',
  status: 'status',
  type: 'type',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  campaignId: 'campaignId',
  leadId: 'leadId',
  direction: 'direction',
  channel: 'channel',
  subject: 'subject',
  body: 'body',
  status: 'status',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  leadId: 'leadId',
  actorType: 'actorType',
  type: 'type',
  description: 'description',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AgentRunScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  agentType: 'agentType',
  status: 'status',
  duration: 'duration',
  tokensUsed: 'tokensUsed',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AgentTaskScalarFieldEnum = {
  id: 'id',
  agentRunId: 'agentRunId',
  payload: 'payload',
  status: 'status',
  assignedAgent: 'assignedAgent',
  resultSummary: 'resultSummary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

exports.LeadStatus = exports.$Enums.LeadStatus = {
  NEW: 'NEW',
  RESEARCHING: 'RESEARCHING',
  RESEARCHED: 'RESEARCHED',
  ENRICHED: 'ENRICHED',
  CONTACTED: 'CONTACTED',
  RESPONDED: 'RESPONDED',
  BOUNCED: 'BOUNCED',
  CONVERTED: 'CONVERTED',
  NURTURING: 'NURTURING',
  DISQUALIFIED: 'DISQUALIFIED'
};

exports.LeadSource = exports.$Enums.LeadSource = {
  APOLLO: 'APOLLO',
  LINKEDIN: 'LINKEDIN',
  CRUNCHBASE: 'CRUNCHBASE',
  WEBSITE: 'WEBSITE',
  MANUAL: 'MANUAL',
  IMPORT: 'IMPORT',
  AGENT: 'AGENT'
};

exports.MessageChannel = exports.$Enums.MessageChannel = {
  EMAIL: 'EMAIL',
  LINKEDIN: 'LINKEDIN'
};

exports.CampaignStatus = exports.$Enums.CampaignStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED'
};

exports.CampaignType = exports.$Enums.CampaignType = {
  EMAIL: 'EMAIL',
  LINKEDIN: 'LINKEDIN',
  MULTICHANNEL: 'MULTICHANNEL'
};

exports.MessageDirection = exports.$Enums.MessageDirection = {
  OUTBOUND: 'OUTBOUND',
  INBOUND: 'INBOUND'
};

exports.MessageStatus = exports.$Enums.MessageStatus = {
  DRAFT: 'DRAFT',
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  OPENED: 'OPENED',
  CLICKED: 'CLICKED',
  BOUNCED: 'BOUNCED',
  FAILED: 'FAILED'
};

exports.ActorType = exports.$Enums.ActorType = {
  USER: 'USER',
  SYSTEM: 'SYSTEM',
  RESEARCH_AGENT: 'RESEARCH_AGENT',
  SALES_AGENT: 'SALES_AGENT',
  CONTENT_AGENT: 'CONTENT_AGENT',
  REVIEW_AGENT: 'REVIEW_AGENT',
  ORCHESTRATOR: 'ORCHESTRATOR'
};

exports.Prisma.ModelName = {
  Organization: 'Organization',
  User: 'User',
  ICP: 'ICP',
  Company: 'Company',
  Contact: 'Contact',
  Lead: 'Lead',
  Sequence: 'Sequence',
  SequenceStep: 'SequenceStep',
  Campaign: 'Campaign',
  Message: 'Message',
  Activity: 'Activity',
  AgentRun: 'AgentRun',
  AgentTask: 'AgentTask'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
