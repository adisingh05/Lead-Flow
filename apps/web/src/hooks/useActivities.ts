import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";
import { Activity, ActivityType } from "@/types";

interface CreateActivityInput {
  type: ActivityType;
  leadId?: string;
  contactId?: string;
  metadata?: Record<string, unknown>;
}

export function useCreateActivity() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateActivityInput) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return apiClient<Activity>("/api/activities", token, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
