import { useQuery } from "@tanstack/react-query";
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
