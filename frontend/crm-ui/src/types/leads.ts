export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  budget_min: number;
  budget_max: number;
  property_interest: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  activity_count: number;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetLeadsResponse {
  results: Lead[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LeadFilters {
  q: string; // search query
  status: string | null;
}

export interface LeadsFilterBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  onClear: () => void;
}

export interface LeadFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: string;
  source?: string;
  budget_min?: number;
  budget_max?: number;
  property_interest?: string;
}
