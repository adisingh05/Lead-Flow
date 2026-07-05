import { useQuery } from "@tanstack/react-query";
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
