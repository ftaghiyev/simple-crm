import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Lead } from "@/types/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { LuArrowUpRight } from "react-icons/lu";
import { getStatusColor } from "@/utils/status";

type LeadsTableProps = {
  leads: Lead[];
};

function LeadsTable({ leads }: LeadsTableProps) {
  const tableHeadItems = [
    { id: "full_name", title: "Full Name" },
    { id: "email", title: "Email" },
    { id: "phone", title: "Phone" },
    { id: "status", title: "Status" },
    { id: "budget", title: "Budget Range" },
    { id: "created_at", title: "Created" },
  ];

  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeadItems.map((item) => (
            <TableHead key={item.id}>
              <span className="flex items-center gap-2">{item.title}</span>
            </TableHead>
          ))}
          <TableHead> </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {leads?.map((lead) => (
          <TableRow
            key={lead.id}
            className={`${
              !lead.is_active ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <TableCell>
              {lead.first_name} {lead.last_name}
            </TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>{lead.phone}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
            </TableCell>
            <TableCell>
              {lead.budget_min && lead.budget_max
                ? `$${lead.budget_min} - $${lead.budget_max}`
                : "N/A"}
            </TableCell>
            <TableCell>
              {format(new Date(lead.created_at), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
              >
                <LuArrowUpRight />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default LeadsTable;
