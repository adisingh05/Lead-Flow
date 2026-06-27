import { apiClient } from "@/lib/api";
import { Lead } from "@/types";

export async function getLeads(organizationId: string): Promise<Lead[]> {
  return apiClient<Lead[]>(`/api/leads?organizationId=${organizationId}`);
}
