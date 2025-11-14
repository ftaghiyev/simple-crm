import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { LeadFilters } from "@/types/leads";

interface LeadsFilterBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  onClear: () => void;
}

export default function LeadsFilterBar({
  filters,
  onChange,
  onClear,
}: LeadsFilterBarProps) {
  return (
    <div className="flex md:flex-wrap md:flex-row flex-col gap-2 items-center">
      <Input
        placeholder="Search leads..."
        className="md:max-w-xs"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />

      <Select
        value={filters.status ?? ""}
        onValueChange={(value) =>
          onChange({ ...filters, status: value === "" ? null : value })
        }
      >
        <SelectTrigger className="md:w-[180px] w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="qualified">Qualified</SelectItem>
          <SelectItem value="negotiation">Negotiation</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="text-white bg-destructive md:bg-white md:text-destructive md:w-fit w-full"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
}
