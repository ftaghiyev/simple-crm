import { useEffect, useState } from "react";
import LeadsTable from "@/components/lead-management/leads-table";
import { useGetLeads } from "@/hooks/leads";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import LeadsFilterBar from "@/components/lead-management/leads-filter-bar";
import { useDebounced } from "@/hooks/use-debounced";
import type { LeadFilters } from "@/types/leads";
import ContentLoading from "@/components/ui/content-loading";
import LeadCreateDialog from "@/components/lead-management/lead-create-dialog";

function LeadManagementDesktop() {
  const [page, setPage] = useState(1);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const [filters, setFilters] = useState<LeadFilters>({
    q: "",
    status: null,
  });

  const debouncedQ = useDebounced(filters.q, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filters.status]);

  const { leads, currentPage, totalPages, loading } = useGetLeads(page, 10, {
    search: debouncedQ,
    status:
      filters.status && filters.status !== "all" ? filters.status : undefined,
  });

  const clearFilters = () =>
    setFilters({
      q: "",
      status: null,
    });

  if (loading) {
    return <ContentLoading loading={loading} />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end px-2 py-2.5">
        <LeadCreateDialog />
      </div>

      <div className="py-2">
        <LeadsFilterBar
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
        />
      </div>

      <div>
        <LeadsTable leads={leads} />
      </div>

      <Pagination className="justify-end py-2.5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={currentPage === 1}
              className={cn(
                currentPage === 1 &&
                  "pointer-events-none opacity-50 cursor-not-allowed"
              )}
              onClick={prevPage}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              aria-disabled={currentPage === totalPages}
              className={cn(
                currentPage === totalPages &&
                  "pointer-events-none opacity-50 cursor-not-allowed"
              )}
              onClick={nextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default LeadManagementDesktop;
