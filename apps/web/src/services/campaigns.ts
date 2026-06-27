import { apiClient } from "@/lib/api";
import { Campaign } from "@/types";

export async function getCampaigns(
  organizationId: string,
): Promise<Campaign[]> {
  return apiClient<Campaign[]>(
    `/api/campaigns?organizationId=${organizationId}`,
  );
}
