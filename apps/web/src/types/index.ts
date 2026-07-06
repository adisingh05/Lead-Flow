export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  size?: "MICRO" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
  revenue?: number;
  country?: string;
  city?: string;
  description?: string;
  linkedin?: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: string;
  organizationId: string;
  companyId?: string;
  company?: Company;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  status:
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "UNQUALIFIED"
    | "CONVERTED"
    | "LOST";
  score: number;
  source?: string;
  notes?: string;
  value?: number;
  organizationId: string;
  companyId?: string;
  contactId?: string;
  campaignId?: string;
  company?: Company;
  contact?: Contact;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  startDate?: string;
  endDate?: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
  leadsCount: number;
  sent: number;
  opened: number;
  replied: number;
  meetings: number;
}

export type ActivityType =
  | "EMAIL_SENT"
  | "EMAIL_OPENED"
  | "EMAIL_CLICKED"
  | "EMAIL_REPLIED"
  | "CALL_MADE"
  | "CALL_ANSWERED"
  | "MEETING_SCHEDULED"
  | "MEETING_COMPLETED"
  | "NOTE_ADDED"
  | "TASK_CREATED"
  | "TASK_COMPLETED"
  | "LINKEDIN_MESSAGE";

export interface Activity {
  id: string;
  type: ActivityType;
  metadata?: Record<string, unknown>;
  userId?: string;
  contactId?: string;
  leadId?: string;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsDataPoint {
  month: string;
  leads: number;
  contacted: number;
  converted: number;
  openRate: number;
  replyRate: number;
  meetings: number;
}
