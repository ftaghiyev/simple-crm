import {
  createLead,
  deleteLead,
  getLead,
  getLeads,
  updateLead,
} from "@/api/leads";
import type { GetLeadsResponse, LeadFormValues } from "@/types/leads";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export function useGetLeads(
  page = 1,
  pageSize = 10,
  extraParams?: Record<string, any>
) {
  const params = useMemo(() => {
    const base: Record<string, any> = {
      page,
      ...extraParams,
    };
    Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
    return base;
  }, [page, pageSize, extraParams]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["leads", params],
    queryFn: ({ signal }) => getLeads(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const results = data?.results || [];
  const total = data?.count || 0;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  return {
    leads: results,
    count: total,
    currentPage: page,
    totalPages,
    loading: isFetching,
    error,
  };
}

export function useGetLeadsInfinite(
  extraParams?: Record<string, string | undefined>
) {
  const params = useMemo(() => {
    const base: Record<string, any> = {
      ...extraParams,
    };
    Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
    return base;
  }, [extraParams]);

  return useInfiniteQuery<GetLeadsResponse>({
    queryKey: ["leads", params],
    queryFn: async ({ pageParam = 1, signal }) => {
      return getLeads({ ...params, page: pageParam }, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: LeadFormValues) => createLead(data),
    onSuccess: () => {
      toast.success("Lead created successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      toast.error("Failed to create lead");
    },
  });

  return {
    create,
    isPending,
    isSuccess,
    isError,
    error,
  };
}

export function useLeadDetail(leadId: number) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => getLead(leadId),
    enabled: !!leadId,
  });

  return {
    lead: data,
    loading: isFetching,
    error,
  };
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  const {
    mutate: update,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      leadId,
      data,
    }: {
      leadId: number;
      data: Partial<LeadFormValues>;
    }) => updateLead(leadId, data),
    onSuccess: () => {
      toast.success("Lead updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      toast.error("Failed to update lead");
    },
  });

  return { updateLead: update, isPending, error };
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ leadId }: { leadId: number }) => deleteLead(leadId),
    onSuccess: () => {
      toast.success("Lead deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      toast.error("Failed to delete lead");
    },
  });

  return { deleteLead: mutate, isPending, error };
}
