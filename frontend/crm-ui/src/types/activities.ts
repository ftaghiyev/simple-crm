export interface Activity {
  id: number;
  lead_id: number;
  user_id?: number | null;
  activity_type: "call" | "email" | "meeting" | "note";
  title: string;
  notes?: string | null;
  duration?: number | null;
  activity_date: string;
  created_at: string;
  user_name?: string | null;
}

export interface ActivityFormValues {
  activity_type: "call" | "email" | "meeting" | "note";
  title: string;
  notes?: string;
  duration?: number;
  activity_date: string;
}
