import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiEdit2,
  FiMoreVertical,
  FiTrash,
  FiPhone,
  FiMail,
  FiEye,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/leads";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import LeadEditDialog from "./lead-edit-dialog";
import LeadDeleteDialog from "./lead-delete-dialog";
import { getStatusColor } from "@/utils/status";

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="relative w-full">
      <CardContent className="flex gap-2 flex-col">
        <div className="absolute top-6 right-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent"
              >
                <FiMoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="flex flex-col w-36 gap-2 p-2.5"
            >
              <DropdownMenuItem asChild>
                <LeadEditDialog lead={lead}>
                  <button className="w-full flex items-center gap-2 text-left">
                    <FiEdit2 /> Edit
                  </button>
                </LeadEditDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <LeadDeleteDialog leadId={lead.id}>
                  <button className="w-full flex items-center gap-2 text-left text-red-600">
                    <FiTrash /> Delete
                  </button>
                </LeadDeleteDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col justify-between gap-1.5">
          <div className="flex gap-1.5 items-center">
            <Badge variant="secondary" className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <span className="text-xs text-gray-500 ml-1.5">#{lead.id}</span>
          </div>
          <span
            className="font-medium cursor-pointer hover:underline"
            onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
          >
            {lead.first_name} {lead.last_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-md bg-secondary/10 border border-secondary/60">
            <FiMail />
          </div>
          <span>{lead.email}</span>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-2">
            <div className="p-0.5 rounded-md bg-secondary/10 border border-secondary/60">
              <FiPhone />
            </div>
            <span>{lead.phone}</span>
          </div>
        )}

        {(lead.budget_min || lead.budget_max) && (
          <div className="text-sm text-gray-600">
            Budget:{" "}
            {lead.budget_min ? `$${lead.budget_min.toLocaleString()}` : "—"}{" "}
            {lead.budget_max ? `- $${lead.budget_max.toLocaleString()}` : ""}
          </div>
        )}

        {lead.property_interest && (
          <div className="text-sm text-gray-600">
            Interest: {lead.property_interest}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
        >
          <FiEye /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
