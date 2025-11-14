import { useParams } from "react-router-dom";
import { useLeadDetail } from "@/hooks/leads";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import LeadActivityForm from "@/components/activities/lead-activity-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Activity } from "@/types/activities";
import { getStatusColor } from "@/utils/status";
import { useActivities } from "@/hooks/activities";
import LeadEditDialog from "@/components/lead-management/lead-edit-dialog";
import LeadDeleteDialog from "@/components/lead-management/lead-delete-dialog";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const leadId = Number(id);

  const { lead, loading: leadLoading } = useLeadDetail(leadId);
  const { activities, loading: activityLoading } = useActivities(leadId);

  if (leadLoading) return <Skeleton className="w-full h-40" />;

  return (
    <div className="flex flex-col gap-6 w-full md:p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              {lead.first_name} {lead.last_name}
            </CardTitle>
            <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{lead.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{lead.phone || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Source</p>
            <p>{lead.source || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Budget</p>
            <p>
              {lead.budget_min
                ? `$${lead.budget_min.toLocaleString()} - $${lead.budget_max?.toLocaleString()}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Property Interest
            </p>
            <p>{lead.property_interest || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p>{format(new Date(lead.created_at), "PPP p")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 md:flex-row flex-col">
        <LeadEditDialog lead={lead} />
        <LeadDeleteDialog leadId={lead.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Activity Timeline
          </CardTitle>
          <CardDescription>
            View or add activites you would like to
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-3 md:px-6">
          <LeadActivityForm leadId={leadId} />
          <ScrollArea className="h-80">
            <ul className="flex flex-col gap-4">
              {activityLoading ? (
                <Skeleton className="w-full h-20" />
              ) : activities.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No activities yet
                </p>
              ) : (
                activities.map((a: Activity) => (
                  <li
                    key={a.id}
                    className="flex flex-col border-l-2 border-secondary pl-3 py-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{a.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(a.activity_date), "PPP p")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {a.activity_type}{" "}
                      {a.duration ? `• ${a.duration} min` : ""}
                    </p>
                    <p className="text-sm">{a.notes}</p>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
