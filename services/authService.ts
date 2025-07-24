import api from "@/lib/axios";

interface LoginPayload {
  emailAddress: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data; // { user, token }
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
}
