import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBriefcase, FiStar, FiFileText, FiSliders, FiUpload } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSection from "../components/ProfileSection";
import SkillsInput from "../components/SkillsInput";
import ProfileProgressCard from "../components/ProfileProgressCard";
import ProfilePreviewCard from "../components/ProfilePreviewCard";
import { fetchMyProfile, updateMyProfile, uploadMyCv, type Profile } from "../api/profile";
import { useAuth } from "../context/AuthContext";

const YEARS_OF_EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const AVAILABILITY_OPTIONS = ["Immediately", "2 weeks notice", "1 month notice", "Open to discuss"];
const JOB_TYPE_OPTIONS = ["Full-time", "Contract", "Internship", "Part-time"];
const WORK_ARRANGEMENT_OPTIONS = ["Remote", "Hybrid", "Onsite"];

const inputClass =
  "w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]";
const labelClass = "mb-2 block text-[13px] font-medium text-[#4B4757]";

function togglePill(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-[1.05px] px-4 py-2 text-[13px] font-medium transition ${
        active
          ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
          : "border-[#ECEBF0] text-[#4B4757] hover:border-[#D8D5E0]"
      }`}
    >
      {label}
    </button>
  );
}

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your profile"))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingCv(true);
    try {
      const updated = await uploadMyCv(file);
      setProfile(updated);
      setNotice("CV uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload your CV");
    } finally {
      setUploadingCv(false);
      // Let the same file be re-selected later (e.g. re-uploading after a fix)
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!profile) return;
    setError("");
    setNotice("");
    setSaving(true);

    try {
      await updateMyProfile({
        name: profile.name,
        headline: profile.headline,
        location: profile.location,
        phone: profile.phone,
        yearsOfExperience: profile.yearsOfExperience,
        skills: profile.skills,
        portfolioLink: profile.portfolioLink,
        linkedin: profile.linkedin,
        preferredJobTypes: profile.preferredJobTypes,
        preferredWorkArrangements: profile.preferredWorkArrangements,
        expectedSalaryMin: profile.expectedSalaryMin,
        expectedSalaryMax: profile.expectedSalaryMax,
        availability: profile.availability,
      });
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile");
    } finally {
      setSaving(false);
    }
  }

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
          <div className="mb-[10px] font-['Bricolage_Grotesque'] font-extrabold text-4xl lg:text-[50px] leading-tight lg:leading-[50px] tracking-tight lg:tracking-[-1.75px] text-[#161320]">
            Let's set you up.
          </div>
          <div className="max-w-[520px] font-['Inter'] text-base lg:text-[16px] leading-[24px] text-[#4B4757]">
            This is what companies see and what we reuse on every application.
            The more complete it is, the stronger you look
          </div>
        </div>

        {(error || notice) && (
          <div className="mb-6">
            {error && (
              <p className="rounded-[10px] bg-[#FFF3F3] px-[14px] py-[10px] text-[13px] text-[#D14343]">
                {error}
              </p>
            )}
            {notice && (
              <p className="mt-2 rounded-[10px] bg-[#F2EEFF] px-[14px] py-[10px] text-[13px] text-[#6D4AFF]">
                {notice}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr] mb-24 lg:mb-[100px]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            <ProfileSection icon={FiUser} title="The basics">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  className={inputClass}
                  value={profile.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className={labelClass}>Professional headline</label>
                <input
                  className={inputClass}
                  value={profile.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  placeholder="e.g. Product Designer with 4 years' experience"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className={inputClass}
                    value={profile.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Lagos, Nigeria"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    value={profile.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+234 ..."
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={`${inputClass} bg-[#FAFAFB] text-[#8B8798]`}
                  value={profile.email}
                  disabled
                  title="Change your email from account settings"
                />
              </div>
            </ProfileSection>

            <ProfileSection icon={FiBriefcase} title="Experience">
              <div>
                <label className={labelClass}>Years of experience</label>
                <select
                  className={inputClass}
                  value={profile.yearsOfExperience}
                  onChange={(e) => update("yearsOfExperience", e.target.value)}
                >
                  <option value="">Select...</option>
                  {YEARS_OF_EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </ProfileSection>

            <ProfileSection icon={FiStar} title="Skills">
              <SkillsInput
                value={profile.skills}
                onChange={(skills) => update("skills", skills)}
              />
            </ProfileSection>

            <ProfileSection icon={FiFileText} title="CV & links">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[#D8D5E0] px-6 py-8 text-center transition hover:border-[#6D4AFF]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F2EEFF] text-[#6D4AFF]">
                    <FiUpload size={16} />
                  </span>
                  {uploadingCv ? (
                    <span className="text-[13px] font-medium text-[#6D4AFF]">Uploading...</span>
                  ) : profile.cvOriginalName ? (
                    <>
                      <span className="text-[13px] font-medium text-[#161320]">
                        {profile.cvOriginalName}
                      </span>
                      <span className="text-[11px] text-[#8B8798]">
                        Click to replace · PDF or Word · up to 5MB
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[13px] font-medium text-[#161320]">
                        Upload your CV
                      </span>
                      <span className="text-[11px] text-[#8B8798]">PDF or Word · up to 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Portfolio link</label>
                  <input
                    className={inputClass}
                    value={profile.portfolioLink}
                    onChange={(e) => update("portfolioLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    className={inputClass}
                    value={profile.linkedin}
                    onChange={(e) => update("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </ProfileSection>

            <ProfileSection icon={FiSliders} title="What you're looking for">
              <div>
                <label className={labelClass}>Preferred job type</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPE_OPTIONS.map((opt) => (
                    <Pill
                      key={opt}
                      label={opt}
                      active={profile.preferredJobTypes.includes(opt)}
                      onClick={() =>
                        update("preferredJobTypes", togglePill(profile.preferredJobTypes, opt))
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Preferred work arrangement</label>
                <div className="flex flex-wrap gap-2">
                  {WORK_ARRANGEMENT_OPTIONS.map((opt) => (
                    <Pill
                      key={opt}
                      label={opt}
                      active={profile.preferredWorkArrangements.includes(opt)}
                      onClick={() =>
                        update(
                          "preferredWorkArrangements",
                          togglePill(profile.preferredWorkArrangements, opt)
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Expected salary (₦ / month)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      className={inputClass}
                      value={profile.expectedSalaryMin ?? ""}
                      onChange={(e) =>
                        update(
                          "expectedSalaryMin",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      className={inputClass}
                      value={profile.expectedSalaryMax ?? ""}
                      onChange={(e) =>
                        update(
                          "expectedSalaryMax",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Availability</label>
                  <select
                    className={inputClass}
                    value={profile.availability}
                    onChange={(e) => update("availability", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <ProfileProgressCard profile={profile} />
            <ProfilePreviewCard profile={profile} />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#6D4AFF] text-[14px] font-semibold text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)] transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Complete your profile to continue"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;
