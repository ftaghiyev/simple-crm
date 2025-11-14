import { axiosClient } from "@/axios-client/axios-client";
import type { ActivityFormValues } from "@/types/activities";

export async function getLeadActivities(leadId: number) {
  const res = await axiosClient.get(`/api/leads/${leadId}/activities`);
  return res.data;
}

export async function createActivity(leadId: number, data: ActivityFormValues) {
  const res = await axiosClient.post(`/api/leads/${leadId}/activities`, data);
  return res.data;
}
