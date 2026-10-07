import apiClient, { extractError } from "../lib/apiClient";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
};

type AuthResponse = {
  token: string;
  user: User;
};

type RegisterResponse = {
  message: string;
  email: string;
};

type MessageResponse = {
  message: string;
};

export class NeedsVerificationError extends Error {
  email: string;

  constructor(message: string, email: string) {
    super(message);
    this.name = "NeedsVerificationError";
    this.email = email;
  }
}

const TOKEN_KEY = "worknest_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function post(path: string, body: object) {
  return apiClient.post(path, body);
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const res = await post("/auth/register", { name, email, password });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not create your account"));
  }
}

export async function verifyEmailRequest(
  email: string,
  otp: string
): Promise<AuthResponse> {
  try {
    const res = await post("/auth/verify-email", { email, otp });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not verify that code"));
  }
}

export async function resendOtpRequest(email: string): Promise<MessageResponse> {
  try {
    const res = await post("/auth/resend-otp", { email });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not resend the code"));
  }
}

export async function loginRequest(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const res = await post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    const e = err as any;
    if (e?.response?.status === 403 && e?.response?.data?.needsVerification) {
      throw new NeedsVerificationError(
        e.response.data.message || "Please verify your email first",
        e.response.data.email || email
      );
    }

    throw new Error(extractError(err, "Could not log you in"));
  }
}

export async function googleAuthRequest(accessToken: string): Promise<AuthResponse> {
  try {
    const res = await post("/auth/google", { accessToken });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not sign you in with Google"));
  }
}

export async function forgotPasswordRequest(
  email: string
): Promise<MessageResponse> {
  try {
    const res = await post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not send the code"));
  }
}

export async function verifyResetOtpRequest(
  email: string,
  otp: string
): Promise<MessageResponse> {
  try {
    const res = await post("/auth/verify-reset-otp", { email, otp });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not verify that code"));
  }
}

export async function resetPasswordRequest(
  email: string,
  otp: string,
  newPassword: string
): Promise<MessageResponse> {
  try {
    const res = await post("/auth/reset-password", { email, otp, newPassword });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not reset your password"));
  }
}

export async function getMeRequest(token: string): Promise<{ user: User }> {
  const res = await apiClient.get<{ user: User }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
