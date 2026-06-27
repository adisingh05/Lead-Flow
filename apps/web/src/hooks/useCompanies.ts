import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "@/services/companies";

export function useCompanies(organizationId: string) {
  return useQuery({
    queryKey: ["companies", organizationId],
    queryFn: () => getCompanies(organizationId),
    enabled: !!organizationId,
  });
}
