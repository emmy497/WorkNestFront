import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiBriefcase,
  FiStar,
  FiFileText,
  FiSliders,
  FiEdit2,
  FiDownload,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSection from "../components/ProfileSection";
import ProfileProgressCard from "../components/ProfileProgressCard";
import { fetchMyProfile, type Profile } from "../api/profile";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase();
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[12px] font-medium text-[#8B8798]">{label}</p>
      <p className={`text-[14px] ${value ? "text-[#161320]" : "italic text-[#B4AFC2]"}`}>
        {value || "Not added yet"}
      </p>
    </div>
  );
}

const ViewProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) {
    return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />
        <div className="py-24 text-center font-['Inter'] text-[14px] text-[#4B4757]">
          {error || "Loading your profile..."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />

        <div className="w-full pt-[43px] pb-[8px] mb-8 lg:mb-[40px]">
          <div className="mb-[12px] font-['Inter'] font-medium text-[11.5px] leading-[17.25px] tracking-[1.61px] uppercase text-[#6D4AFF]">
            Your profile
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#6D4AFF] text-[18px] font-semibold text-white">
                {initials(profile.name) || "?"}
              </span>
              <div>
                <div className="font-['Bricolage_Grotesque'] font-extrabold text-2xl lg:text-[32px] leading-tight text-[#161320]">
                  {profile.name}
                </div>
                <div className="font-['Inter'] text-[14px] text-[#4B4757]">
                  {profile.headline || "No headline yet"}
                </div>
              </div>
            </div>

            <Link
              to="/profile/edit"
              className="flex h-[42px] items-center gap-2 rounded-full border-[1.5px] border-[#6D4AFF] px-5 text-[13.5px] font-semibold text-[#6D4AFF] transition hover:bg-[#F2EEFF]"
            >
              <FiEdit2 size={14} />
              Edit profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr] mb-24 lg:mb-[100px]">
          <div className="flex flex-col gap-6">
            <ProfileSection icon={FiUser} title="The basics">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Location" value={profile.location} />
                <Field label="Phone" value={profile.phone} />
              </div>
              <Field label="Email" value={profile.email} />
            </ProfileSection>

            <ProfileSection icon={FiBriefcase} title="Experience">
              <Field label="Years of experience" value={profile.yearsOfExperience} />
            </ProfileSection>

            <ProfileSection icon={FiStar} title="Skills">
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#F2EEFF] px-3 py-1.5 text-[13px] font-medium text-[#6D4AFF]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] italic text-[#B4AFC2]">No skills added yet</p>
              )}
            </ProfileSection>

            <ProfileSection icon={FiFileText} title="CV & links">
              {profile.cvUrl ? (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-fit items-center gap-2 rounded-[12px] border-[1.05px] border-[#ECEBF0] px-4 py-3 text-[13.5px] font-medium text-[#161320] transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
                >
                  <FiDownload size={15} />
                  {profile.cvOriginalName || "View CV"}
                </a>
              ) : (
                <p className="text-[14px] italic text-[#B4AFC2]">No CV uploaded yet</p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Portfolio link" value={profile.portfolioLink} />
                <Field label="LinkedIn" value={profile.linkedin} />
              </div>
            </ProfileSection>

            <ProfileSection icon={FiSliders} title="What you're looking for">
              <div>
                <p className="mb-2 text-[12px] font-medium text-[#8B8798]">
                  Preferred job type
                </p>
                {profile.preferredJobTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredJobTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border-[1.05px] border-[#ECEBF0] px-3 py-1.5 text-[13px] text-[#4B4757]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] italic text-[#B4AFC2]">Not set yet</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-[12px] font-medium text-[#8B8798]">
                  Preferred work arrangement
                </p>
                {profile.preferredWorkArrangements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredWorkArrangements.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border-[1.05px] border-[#ECEBF0] px-3 py-1.5 text-[13px] text-[#4B4757]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] italic text-[#B4AFC2]">Not set yet</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Expected salary (₦ / month)"
                  value={
                    profile.expectedSalaryMin || profile.expectedSalaryMax
                      ? `${profile.expectedSalaryMin?.toLocaleString() ?? "?"} - ${
                          profile.expectedSalaryMax?.toLocaleString() ?? "?"
                        }`
                      : ""
                  }
                />
                <Field label="Availability" value={profile.availability} />
              </div>
            </ProfileSection>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <ProfileProgressCard profile={profile} />

            <Link
              to="/profile/edit"
              className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#6D4AFF] text-[14px] font-semibold text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)] transition hover:bg-[#5f3ce6]"
            >
              Edit profile
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ViewProfile;
