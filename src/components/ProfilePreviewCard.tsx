import type { Profile } from "../api/profile";

type ProfilePreviewCardProps = {
  profile: Pick<Profile, "name" | "headline" | "skills">;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase();
}

// A live preview of the little card a recruiter sees when your application
// shows up in their list — reusing the same name/headline/skills the
// candidate is filling in above, so it updates as they type.
const ProfilePreviewCard = ({ profile }: ProfilePreviewCardProps) => {
  return (
    <div className="rounded-[16px] bg-[#140A28] p-5">
      <p className="mb-3 text-[10.5px] font-medium tracking-[1.4px] text-[#F5B03C]">
        HOW COMPANIES SEE YOU
      </p>

      <div className="flex items-center gap-3 rounded-[12px] border border-[#FFFFFF1F] bg-[#1C1136] p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D4AFF] text-[13px] font-semibold text-white">
          {initials(profile.name) || "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-white">
            {profile.name || "Your name"}
          </p>
          <p className="truncate text-[12px] text-[hsla(0,0%,100%,0.55)]">
            {profile.headline || "Your headline"}
          </p>
          {profile.skills.length > 0 ? (
            <p className="mt-1 truncate text-[11px] text-[hsla(0,0%,100%,0.4)]">
              {profile.skills.slice(0, 3).join(" · ")}
            </p>
          ) : (
            <p className="mt-1 truncate text-[11px] text-[hsla(0,0%,100%,0.4)]">
              Add skills to preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreviewCard;
