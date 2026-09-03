import type { Profile } from "../api/profile";

export type ProfileSectionKey =
  | "basics"
  | "experience"
  | "skills"
  | "cv"
  | "preferences";

export type ProfileSectionStatus = {
  key: ProfileSectionKey;
  label: string;
  complete: boolean;
};

// One check per section, matching the five cards on the edit-profile page.
// Each section is worth an equal fifth of the total — simple, and it means
// the checklist and the percentage never disagree with each other.
export function getProfileSections(
  profile: Pick<
    Profile,
    | "headline"
    | "location"
    | "phone"
    | "yearsOfExperience"
    | "skills"
    | "cvUrl"
    | "preferredJobTypes"
    | "preferredWorkArrangements"
    | "availability"
  >
): ProfileSectionStatus[] {
  return [
    {
      key: "basics",
      label: "The basics",
      complete: Boolean(profile.headline && profile.location && profile.phone),
    },
    {
      key: "experience",
      label: "Experience",
      complete: Boolean(profile.yearsOfExperience),
    },
    {
      key: "skills",
      label: "Skills",
      complete: profile.skills.length >= 3,
    },
    {
      key: "cv",
      label: "CV & links",
      complete: Boolean(profile.cvUrl),
    },
    {
      key: "preferences",
      label: "Preferences",
      complete: Boolean(
        profile.preferredJobTypes.length > 0 &&
          profile.preferredWorkArrangements.length > 0 &&
          profile.availability
      ),
    },
  ];
}

export function getProfileCompletionPercent(
  profile: Parameters<typeof getProfileSections>[0]
): number {
  const sections = getProfileSections(profile);
  const doneCount = sections.filter((s) => s.complete).length;
  return Math.round((doneCount / sections.length) * 100);
}
