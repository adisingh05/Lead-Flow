import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Contact } from "@/types";

export function useContacts(organizationId: string) {
  const { getToken } = useAuth();

  return useQuery<Contact[]>({
    queryKey: ["contacts", organizationId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Contact[]>(
        `/api/contacts?organizationId=${organizationId}`,
        token,
      );
    },
    enabled: !!organizationId,
  });
}
