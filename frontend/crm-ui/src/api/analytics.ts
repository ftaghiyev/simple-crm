import { axiosClient } from "@/axios-client/axios-client";

export async function getDashboardStats() {
  const { data } = await axiosClient.get("/api/dashboard");
  return data;
}
