import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { AnalyticsDataPoint } from "@/types";

export function useAnalytics(organizationId: string) {
  const { getToken } = useAuth();

  return useQuery<AnalyticsDataPoint[]>({
    queryKey: ["analytics", organizationId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<AnalyticsDataPoint[]>(
        `/api/analytics/monthly?organizationId=${organizationId}`,
        token,
      );
    },
    enabled: !!organizationId,
  });
}
