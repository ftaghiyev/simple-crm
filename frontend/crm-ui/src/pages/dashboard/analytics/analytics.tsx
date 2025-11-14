import LeadsStatusChart from "@/components/analytics/leads-status-chart";
import { MetricCard } from "@/components/analytics/metric-card";
import { RecentActivities } from "@/components/analytics/recent-activities";
import { useGetDashboardStats } from "@/hooks/analytics";

function Analytics() {
  const { data, isLoading, isError } = useGetDashboardStats();

  if (isLoading) return <div className="p-4">Loading dashboard...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load dashboard!</div>;

  return (
    <div className="md:p-4 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-4 gap-2.5">
        <MetricCard
          title="Total Leads"
          value={data!.total_leads}
          className="bg-black text-secondary"
        />
        <MetricCard
          title="New Leads This Week"
          value={data!.new_leads_this_week}
        />
        <MetricCard
          title="Closed Leads This Month"
          value={data!.closed_leads_this_month}
        />
        <MetricCard title="Total Activities" value={data!.total_activities} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Leads by Status</h2>
          <LeadsStatusChart data={data!.leads_by_status} />
        </div>

        <RecentActivities activities={data!.recent_activities} />
      </div>
    </div>
  );
}

export default Analytics;
