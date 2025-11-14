import { getDashboardStats } from "@/api/analytics";
import type { DashboardStats } from "@/types/analytics";
import { useQuery } from "@tanstack/react-query";

export function useGetDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["analytics"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2,
  });
}
