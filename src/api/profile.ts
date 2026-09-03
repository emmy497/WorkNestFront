import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
  headline: string;
  location: string;
  phone: string;
  yearsOfExperience: string;
  skills: string[];
  cvUrl: string;
  cvOriginalName: string;
  portfolioLink: string;
  linkedin: string;
  preferredJobTypes: string[];
  preferredWorkArrangements: string[];
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  availability: string;
};

// The fields a candidate is allowed to update themselves. `Partial` because
// we usually only send whichever fields the user actually changed.
export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | "name"
    | "headline"
    | "location"
    | "phone"
    | "yearsOfExperience"
    | "skills"
    | "portfolioLink"
    | "linkedin"
    | "preferredJobTypes"
    | "preferredWorkArrangements"
    | "expectedSalaryMin"
    | "expectedSalaryMax"
    | "availability"
  >
>;

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------------------------------------------
// GET /api/profile/me
// ---------------------------------------------------------------------------
export async function fetchMyProfile(): Promise<Profile> {
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not load your profile"));
  }

  const data = await response.json();
  return data.profile;
}

// ---------------------------------------------------------------------------
// PATCH /api/profile/me
// ---------------------------------------------------------------------------
export async function updateMyProfile(updates: ProfileUpdate): Promise<Profile> {
  const response = await fetch(`${API_URL}/profile/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not save your profile"));
  }

  const data = await response.json();
  return data.profile;
}

// ---------------------------------------------------------------------------
// POST /api/profile/me/cv   (multipart/form-data)
//
// No "Content-Type" header here on purpose — the browser sets it itself,
// including the multipart boundary, which we cannot replicate by hand.
// ---------------------------------------------------------------------------
export async function uploadMyCv(file: File): Promise<Profile> {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await fetch(`${API_URL}/profile/me/cv`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not upload your CV"));
  }

  const data = await response.json();
  return data.profile;
}
