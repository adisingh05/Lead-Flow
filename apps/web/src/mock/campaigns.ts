import { Campaign } from "@/types";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q2 Fintech Outreach",
    status: "active",
    organizationId: "mock",
    startDate: "2026-06-01",
  },
  {
    id: "2",
    name: "SaaS Founders India",
    status: "active",
    organizationId: "mock",
    startDate: "2026-06-05",
  },
  {
    id: "3",
    name: "DevTools Decision Makers",
    status: "paused",
    organizationId: "mock",
    startDate: "2026-05-20",
  },
  {
    id: "4",
    name: "E-Commerce Growth Leaders",
    status: "completed",
    organizationId: "mock",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
  },
  {
    id: "5",
    name: "HRTech Bangalore",
    status: "draft",
    organizationId: "mock",
    startDate: "2026-06-20",
  },
];
