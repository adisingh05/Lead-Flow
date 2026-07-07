import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Lead } from "@/types";

export function useLeads(organizationId: string) {
  const { getToken } = useAuth();

  return useQuery<Lead[]>({
    queryKey: ["leads", organizationId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Lead[]>(
        `/api/leads?organizationId=${organizationId}`,
        token,
      );
    },
    enabled: !!organizationId,
  });
}

interface CreateLeadInput {
  organizationId: string;
  companyId?: string;
  contactId?: string;
  campaignId?: string;
  source?: string;
  value?: number;
}

export function useCreateLead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLeadInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Lead>("/api/leads", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
