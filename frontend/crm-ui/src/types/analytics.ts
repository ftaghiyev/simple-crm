export interface LeadsByStatus {
  status: string;
  count: number;
}

export interface DashboardActivity {
  id: number;
  lead_id: number;
  user_id: number;
  activity_type: string;
  title: string;
  notes?: string;
  duration?: number;
  activity_date: string;
  created_at: string;
  user_name: string;
}

export interface DashboardStats {
  total_leads: number;
  new_leads_this_week: number;
  closed_leads_this_month: number;
  total_activities: number;
  leads_by_status: LeadsByStatus[];
  recent_activities: DashboardActivity[];
}
