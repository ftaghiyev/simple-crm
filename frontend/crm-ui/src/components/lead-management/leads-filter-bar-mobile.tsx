import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import LeadsFilterBar from "./leads-filter-bar";
import type { LeadFilters } from "@/types/leads";

interface MobileLeadFiltersProps {
  filters: LeadFilters;
  onChange: (next: LeadFilters) => void;
  onClear: () => void;
}

function LeadsMobileFilterBar({
  filters,
  onChange,
  onClear,
}: MobileLeadFiltersProps) {
  return (
    <Drawer repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4 overflow-y-auto gap-2">
        <DrawerHeader>
          <DrawerTitle>Filter & Sort</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <LeadsFilterBar
          filters={filters}
          onChange={onChange}
          onClear={onClear}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default LeadsMobileFilterBar;
