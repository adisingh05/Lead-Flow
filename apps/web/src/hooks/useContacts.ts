import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/services/contacts";

export function useContacts(organizationId: string) {
  return useQuery({
    queryKey: ["contacts", organizationId],
    queryFn: () => getContacts(organizationId),
    enabled: !!organizationId,
  });
}
