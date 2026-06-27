import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/services/leads";

export function useLeads(organizationId: string) {
  return useQuery({
    queryKey: ["leads", organizationId],
    queryFn: () => getLeads(organizationId),
    enabled: !!organizationId,
  });
}
