import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Activity, ActivityType } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityFilters {
  leadId?: string;
  contactId?: string;
  companyId?: string;
  campaignId?: string;
  userId?: string;
  type?: string;
  search?: string;
  from?: string;
  to?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginatedActivities {
  items: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreateActivityInput {
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  leadId?: string;
  contactId?: string;
  companyId?: string;
  campaignId?: string;
}

interface UpdateActivityInput {
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useActivities(filters: ActivityFilters = {}) {
  const { getToken } = useAuth();

  return useQuery<PaginatedActivities>({
    queryKey: ["activities", filters],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const params = new URLSearchParams();
      if (filters.leadId) params.set("leadId", filters.leadId);
      if (filters.contactId) params.set("contactId", filters.contactId);
      if (filters.companyId) params.set("companyId", filters.companyId);
      if (filters.campaignId) params.set("campaignId", filters.campaignId);
      if (filters.userId) params.set("userId", filters.userId);
      if (filters.type) params.set("type", filters.type);
      if (filters.search) params.set("search", filters.search);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const query = params.toString();
      return apiClient<PaginatedActivities>(
        `/activities${query ? `?${query}` : ""}`,
        token,
      );
    },
  });
}

export function useTimeline(filters: Omit<ActivityFilters, "sortOrder"> = {}) {
  const { getToken } = useAuth();

  return useQuery<PaginatedActivities>({
    queryKey: ["activities-timeline", filters],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const params = new URLSearchParams();
      if (filters.leadId) params.set("leadId", filters.leadId);
      if (filters.contactId) params.set("contactId", filters.contactId);
      if (filters.companyId) params.set("companyId", filters.companyId);
      if (filters.campaignId) params.set("campaignId", filters.campaignId);
      if (filters.userId) params.set("userId", filters.userId);
      if (filters.type) params.set("type", filters.type);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const query = params.toString();
      return apiClient<PaginatedActivities>(
        `/activities/timeline${query ? `?${query}` : ""}`,
        token,
      );
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateActivity() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateActivityInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Activity>("/activities", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activities-timeline"] });
    },
  });
}

export function useUpdateActivity() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateActivityInput;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Activity>(`/activities/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activities-timeline"] });
    },
  });
}

export function useDeleteActivity() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<void>(`/activities/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activities-timeline"] });
    },
  });
}
