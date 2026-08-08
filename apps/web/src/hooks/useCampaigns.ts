import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Campaign } from "@/types";

interface CampaignFilters {
  search?: string;
  status?: string;
  sortBy?: "name" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginatedCampaigns {
  items: Campaign[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CampaignMetrics {
  totalLeads: number;
  sent: number;
  opened: number;
  replied: number;
  meetings: number;
  openRate: number;
  replyRate: number;
  meetingRate: number;
}

export function useCampaigns(filters: CampaignFilters = {}) {
  const { getToken } = useAuth();

  return useQuery<PaginatedCampaigns>({
    queryKey: ["campaigns", filters],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const query = params.toString();
      return apiClient<PaginatedCampaigns>(
        `/campaigns${query ? `?${query}` : ""}`,
        token,
      );
    },
  });
}

export function useCampaignMetrics(id: string) {
  const { getToken } = useAuth();

  return useQuery<CampaignMetrics>({
    queryKey: ["campaign-metrics", id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<CampaignMetrics>(`/campaigns/${id}/metrics`, token);
    },
    enabled: !!id,
  });
}

interface CreateCampaignInput {
  name: string;
  description?: string;
}

export function useCreateCampaign() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCampaignInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign>("/campaigns", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

interface UpdateCampaignInput {
  name?: string;
  description?: string;
  status?: string;
}

export function useUpdateCampaign() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCampaignInput;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign>(`/campaigns/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
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
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Campaign>(`/campaigns/${id}`, token, {
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
      return apiClient<void>(`/campaigns/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
