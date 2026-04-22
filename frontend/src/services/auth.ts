import { http } from "./http.ts";

export type RegisterPayload = { name: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };
export type LoginResponse = { access_token: string; token_type?: string };

export type MeResponse = {
  id: number;
  name: string;
  email: string;
  is_email_verified: boolean;
  is_admin: boolean;
  avatar?: string;
  phone?: string;
};

export async function register(payload: RegisterPayload) {
  const { data } = await http.post("/auth/register", payload);
  return data as { ok: boolean; message: string };
}

export async function login(payload: LoginPayload) {
  const { data } = await http.post("/auth/login", payload);
  return data as LoginResponse;
}

export async function me() {
  const { data } = await http.get("/auth/me");
  return data as MeResponse;
}

export const updateProfile = async (formData: FormData) => {
  const { data } = await http.post('/auth/me', formData);
  return data;
};

export async function verifyEmail(token: string) {
  const { data } = await http.get(`/auth/verify-email?token=${token}`);
  return data;
}