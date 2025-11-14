import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardActivity } from "@/types/analytics";
import { format } from "date-fns";
import type { JSX } from "react";
import { FiPhone, FiMail, FiCalendar, FiFileText } from "react-icons/fi";

const iconMap: Record<string, JSX.Element> = {
  call: <FiPhone />,
  email: <FiMail />,
  meeting: <FiCalendar />,
  note: <FiFileText />,
};

export function RecentActivities({
  activities,
}: {
  activities: DashboardActivity[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-center gap-3 border-b pb-2 last:border-none"
          >
            <div className="p-2 rounded-full bg-secondary/20 border border-secondary/60">
              {iconMap[act.activity_type]}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{act.title}</span>
              <span className="text-xs text-muted-foreground">
                {act.user_name} ·{" "}
                {format(new Date(act.activity_date), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
