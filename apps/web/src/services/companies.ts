import { apiClient } from "@/lib/api";
import { Company } from "@/types";

export async function getCompanies(organizationId: string): Promise<Company[]> {
  return apiClient<Company[]>(
    `/api/companies?organizationId=${organizationId}`,
  );
}

export async function createCompany(data: {
  name: string;
  organizationId: string;
}): Promise<Company> {
  return apiClient<Company>("/api/companies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
