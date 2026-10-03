import apiClient, { extractError } from "../lib/apiClient";


// The shape of a user as the API sends it back.
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

// Registering no longer logs you in. You get a message instead, and have to
// enter the code we emailed before you get a token.
type RegisterResponse = {
  message: string;
  email: string;
};

type MessageResponse = {
  message: string;
};

// A custom error type, so the login page can tell the difference between
// "wrong password" and "correct password but email not verified yet".
export class NeedsVerificationError extends Error {
  email: string;

  constructor(message: string, email: string) {
    super(message);
    this.name = "NeedsVerificationError";
    this.email = email;
  }
}

// ---------------------------------------------------------------------------
// Where we keep the token.
//
// localStorage survives a page refresh and closing the browser, which is why
// you stay logged in. It is per-browser, so logging in on your phone doesn't
// log you in on your laptop.
//
// A note for later: localStorage can be read by any JavaScript on the page,
// so a cross-site-scripting bug would expose the token. The more secure
// option is an httpOnly cookie, which JavaScript cannot read at all. That is
// harder to set up, so we start here.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// A tiny helper, since every request below is the same POST shape.
async function post(path: string, body: object) {
  return apiClient.post(path, body);
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
//
// Creates the account and emails a code. Does NOT log you in yet.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/auth/verify-email
//
// Sends the 6-digit code back. If it's right, we finally get a token.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/auth/resend-otp
// ---------------------------------------------------------------------------
export async function resendOtpRequest(email: string): Promise<MessageResponse> {
  try {
    const res = await post("/auth/resend-otp", { email });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not resend the code"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/auth/google
//
// `accessToken` comes from Google's own popup (via useGoogleLogin), not
// from anything the user typed. The server checks it against Google before
// trusting it — see the note in the backend controller.
// ---------------------------------------------------------------------------
export async function googleAuthRequest(accessToken: string): Promise<AuthResponse> {
  try {
    const res = await post("/auth/google", { accessToken });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not sign you in with Google"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/forgot-password
//
// Note: this always succeeds, even for an email that isn't registered.
// That's deliberate — see the comment in the backend controller.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/auth/verify-reset-otp
//
// Checks the code without resetting the password yet — this is what lets
// the "reset password" step only show up once the code is confirmed right.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/auth/reset-password
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// GET /api/auth/me
//
// This is how we check on page load whether the saved token is still good.
// Notice the Authorization header — that is the token being sent back.
//
// Deliberately NOT wrapped in try/catch like the requests above: AuthContext
// needs the raw axios error (specifically err.response?.status) to tell "the
// server rejected this token" (401) apart from "couldn't reach the server
// right now" (a dropped connection, the backend cold-starting) — only the
// first of those should ever log someone out.
// ---------------------------------------------------------------------------
export async function getMeRequest(token: string): Promise<{ user: User }> {
  const res = await apiClient.get<{ user: User }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
