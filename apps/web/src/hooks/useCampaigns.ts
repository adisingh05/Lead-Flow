import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface CreateCampaignInput {
  name: string;
  organizationId: string;
  description?: string;
}

export function useCreateCampaign() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCampaignInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign>("/api/campaigns", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Campaign["status"];
    }) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign>(`/api/campaigns/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<void>(`/api/campaigns/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
