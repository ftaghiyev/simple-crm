import { axiosClient } from "@/axios-client/axios-client";
import type { LeadFormValues } from "@/types/leads";

export const getLeads = async (
  params: Record<string, any>,
  signal?: AbortSignal
) => {
  const res = await axiosClient.get("/api/leads", { params, signal });
  return res.data;
};

export async function createLead(data: LeadFormValues) {
  const res = await axiosClient.post("/api/leads", data);
  return res.data;
}

export async function getLead(id: number) {
  const res = await axiosClient.get(`/api/leads/${id}`);
  return res.data;
}

export async function updateLead(
  leadId: number,
  data: Partial<LeadFormValues>
) {
  const res = await axiosClient.put(`/api/leads/${leadId}`, data);
  return res.data;
}

export async function deleteLead(leadId: number) {
  const res = await axiosClient.delete(`/api/leads/${leadId}`);
  return res.data;
}
