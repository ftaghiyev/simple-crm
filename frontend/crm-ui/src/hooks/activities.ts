import { createActivity, getLeadActivities } from "@/api/activities";
import type { ActivityFormValues } from "@/types/activities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useActivities(leadId: number) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["lead-activities", leadId],
    queryFn: () => getLeadActivities(leadId),
    enabled: !!leadId,
  });

  return {
    activities: data || [],
    loading: isFetching,
    error,
  };
}

export function useCreateActivity(leadId: number) {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: (data: ActivityFormValues) => createActivity(leadId, data),
    onSuccess: () => {
      toast.success("Activity added successfully");
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadId] });
    },
    onError: () => {
      toast.error("Failed to add activity");
    },
  });

  return { create, isPending, isError, isSuccess };
}
