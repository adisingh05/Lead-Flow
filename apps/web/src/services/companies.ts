import { apiClient } from "@/lib/api";

export async function getCompanies(organizationId: string, token: string) {
  return apiClient(`/api/companies?organizationId=${organizationId}`, token);
}

export async function createCompany(
  token: string,
  data: { name: string; organizationId: string },
) {
  return apiClient("/api/companies", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
