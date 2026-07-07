import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Company } from "@/types";

export function useCompanies(organizationId: string) {
  const { getToken } = useAuth();

  return useQuery<Company[]>({
    queryKey: ["companies", organizationId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Company[]>(
        `/api/companies?organizationId=${organizationId}`,
        token,
      );
    },
    enabled: !!organizationId,
  });
}

interface CreateCompanyInput {
  name: string;
  organizationId: string;
  domain?: string;
  website?: string;
  industry?: string;
}

export function useCreateCompany() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCompanyInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Company>("/api/companies", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
