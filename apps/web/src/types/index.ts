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
    | "new"
    | "qualified"
    | "contacted"
    | "responded"
    | "meeting"
    | "won"
    | "lost";
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
  status: "draft" | "active" | "paused" | "completed" | "archived";
  startDate?: string;
  endDate?: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
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
