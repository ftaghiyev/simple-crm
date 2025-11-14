import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LuUsers, LuTrendingUp } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { RecentActivities } from "@/components/analytics/recent-activities";
import { useGetDashboardStats } from "@/hooks/analytics";

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useGetDashboardStats();

  const quickLinks = [
    {
      title: "Lead Management",
      icon: LuUsers,
      description: "View and manage leads",
      to: "/dashboard/lead-management",
      color: "text-blue-600",
    },
    {
      title: "Analytics",
      icon: LuTrendingUp,
      description: "Track your performance",
      to: "/dashboard/analytics",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-muted rounded-lg px-6 py-5 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          Welcome back{user ? `, ${user.first_name}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your leads, appointments, and performance - all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link to={link.to} key={link.title}>
            <Card
              className={cn(
                "group h-full hover:shadow-md hover:-translate-y-2 transition-all cursor-pointer"
              )}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 gap-2">
                <div
                  className={cn(
                    "p-2 rounded-full bg-secondary/10 group-hover:bg-black group-hover:text-white transition",
                    link.color
                  )}
                >
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-center">
                  {link.title}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {link.description}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-24" />
      ) : data && data.recent_activities.length > 0 ? (
        <RecentActivities activities={data.recent_activities} />
      ) : (
        <div className="text-center text-muted-foreground py-6 text-sm">
          No recent activities yet. Start by adding a new lead.
        </div>
      )}
    </div>
  );
}
