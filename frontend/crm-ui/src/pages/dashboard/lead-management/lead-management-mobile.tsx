import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useDebounced } from "@/hooks/use-debounced";
import LeadCard from "@/components/lead-management/lead-card";
import LeadCreateDialog from "@/components/lead-management/lead-create-dialog";
import type { Lead, LeadFilters } from "@/types/leads";
import LeadsMobileFilterBar from "@/components/lead-management/leads-filter-bar-mobile";
import { useGetLeadsInfinite } from "@/hooks/leads";

function LeadManagementMobile() {
  const [filters, setFilters] = useState<LeadFilters>({
    q: "",
    status: null,
  });

  const debouncedQ = useDebounced(filters.q, 400);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLeadsInfinite({
      search: debouncedQ || undefined,
      status: filters.status || undefined,
    });

  const allLeads = data?.pages.flatMap((p) => p.results) || [];

  const clearFilters = () =>
    setFilters({
      q: "",
      status: "",
    });

  return (
    <div className="flex flex-col gap-4">
      <LeadCreateDialog>
        <Button className="text-secondary">
          <FiPlus className="size-5" /> Add Lead
        </Button>
      </LeadCreateDialog>

      <LeadsMobileFilterBar
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />

      {allLeads.map((lead: Lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}

      {hasNextPage && (
        <Button
          className="self-center"
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}

export default LeadManagementMobile;
