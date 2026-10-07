import apiClient, { extractError } from "../lib/apiClient";

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

export async function fetchMyProfile(): Promise<Profile> {
  try {
    const res = await apiClient.get<{ profile: Profile }>("/profile/me");
    return res.data.profile;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your profile"));
  }
}

export async function updateMyProfile(updates: ProfileUpdate): Promise<Profile> {
  try {
    const res = await apiClient.patch<{ profile: Profile }>("/profile/me", updates);
    return res.data.profile;
  } catch (err) {
    throw new Error(extractError(err, "Could not save your profile"));
  }
}

export async function uploadMyCv(file: File): Promise<Profile> {
  const formData = new FormData();
  formData.append("cv", file);

  try {
    const res = await apiClient.post<{ profile: Profile }>("/profile/me/cv", formData);
    return res.data.profile;
  } catch (err) {
    throw new Error(extractError(err, "Could not upload your CV"));
  }
}
