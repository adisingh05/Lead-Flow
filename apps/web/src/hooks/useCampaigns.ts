import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/campaigns";

export function useCampaigns(organizationId: string) {
  return useQuery({
    queryKey: ["campaigns", organizationId],
    queryFn: () => getCampaigns(organizationId),
    enabled: !!organizationId,
  });
}
