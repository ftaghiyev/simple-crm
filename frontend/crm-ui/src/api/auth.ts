import { axiosClient } from "@/axios-client/axios-client";
import type { LoginFormValues, RegisterPayload } from "@/types/auth";

export async function registerUser(data: RegisterPayload) {
  const res = await axiosClient.post("/api/users/register", data);
  return res.data;
}

export async function loginUser(data: LoginFormValues) {
  const res = await axiosClient.post("/api/users/login", data);
  return res.data;
}
