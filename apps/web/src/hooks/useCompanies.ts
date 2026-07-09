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

export function useUpdateCompany() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, website, industry }: { id: string; name?: string; website?: string; industry?: string }) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Company>(`/api/companies/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ name, website, industry }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useDeleteCompany() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<void>(`/api/companies/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
