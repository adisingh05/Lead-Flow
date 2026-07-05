import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Campaign } from "@/types";

export function useCampaigns(organizationId: string) {
  const { getToken } = useAuth();

  return useQuery<Campaign[]>({
    queryKey: ["campaigns", organizationId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign[]>(
        `/api/campaigns?organizationId=${organizationId}`,
        token,
      );
    },
    enabled: !!organizationId,
  });
}
