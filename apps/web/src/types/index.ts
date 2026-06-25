export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  location: string;
  website: string;
  status: "active" | "inactive" | "prospect";
  logo?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  companyId: string;
  linkedin?: string;
  status: "active" | "inactive" | "bounced";
}

export interface Lead {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  title: string;
  status:
    | "new"
    | "qualified"
    | "contacted"
    | "responded"
    | "meeting"
    | "won"
    | "lost";
  score: number;
  value?: number;
  source: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  leads: number;
  sent: number;
  opened: number;
  replied: number;
  meetings: number;
  startDate: string;
  endDate?: string;
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
