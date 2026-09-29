import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiFileText } from "react-icons/fi";

import ApplyLayout from "./ApplyLayout";
import ApplySubmitted from "./ApplySubmitted";
import { fetchJobById } from "../../api/jobs";
import {
  fetchApplicationPrefill,
  checkAlreadyApplied,
  submitApplication,
  type ApplicationDraft,
} from "../../api/applications";
import { uploadMyCv } from "../../api/profile";
import { toast } from "../../lib/toast";
import { useAuth } from "../../context/AuthContext";
import type { Job } from "../../types/job";

// The dropdown options. These match the ones on the Edit Profile page, so a
// candidate's saved answer always lines up with an option here.
const EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const AVAILABILITY_OPTIONS = [
  "Immediately",
  "2 weeks notice",
  "1 month notice",
  "Open to discuss",
];

// An empty draft, used before the profile has loaded.
const emptyDraft: ApplicationDraft = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  cvUrl: "",
  cvOriginalName: "",
  portfolioLink: "",
  linkedin: "",
  yearsOfExperience: "",
  availability: "",
  expectedSalary: "",
  whyThisRole: "",
};

const inputClass =
  "w-full h-[45px] rounded-[12px] border-[1.05px] border-[#ECEBF0] bg-white px-[15px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]";

const labelClass =
  "mb-[7px] block font-['Inter'] font-medium text-[13px] text-[#4B4757]";

const Apply = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  // authLoading: whether AuthContext has finished checking the saved token
  // yet. Without waiting on it, a genuinely logged-in candidate whose token
  // check hasn't resolved yet would briefly be treated as a guest.
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  // Which of the four steps we're on, 0-based.
  const [step, setStep] = useState(0);

  // Everything the wizard collects. One object rather than a dozen
  // useStates, so passing it to the API at the end is a single line.
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);

  // Did any of step 1 / step 2 come from the profile? Drives the little
  // "Filled from your profile" badge.
  const [prefilled, setPrefilled] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  // Set once the application goes through — swaps the whole page for the
  // success screen.
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // A tiny helper so each input can update one field without rewriting
  // the whole object by hand every time.
  function update<K extends keyof ApplicationDraft>(
    key: K,
    value: ApplicationDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // Load the job, and — only for a logged-in candidate — the profile
  // prefill and whether they've already applied. A guest has no profile to
  // prefill from and no account to check "already applied" against, and
  // both of those calls 401 without a token, so they're skipped entirely
  // rather than failing the whole Promise.all.
  useEffect(() => {
    if (!jobId || authLoading) return;

    let cancelled = false;

    async function load() {
      try {
        const [jobData, prefill, applied] = await Promise.all([
          fetchJobById(jobId as string),
          isLoggedIn ? fetchApplicationPrefill() : Promise.resolve(null),
          isLoggedIn ? checkAlreadyApplied(jobId as string) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        // Already applied — send them to their applications instead of
        // letting them fill in a form that will be rejected.
        if (applied?.applied) {
          toast.info("You've already applied", jobData.title);
          navigate("/applications");
          return;
        }

        setJob(jobData);

        if (prefill) {
          setDraft((prev) => ({
            ...prev,
            ...prefill,
            // Default the salary field to the job's own range, as a starting
            // point the candidate can edit.
            expectedSalary: formatRange(jobData),
          }));

          // If we got a name and email back, step 1 is already filled in.
          setPrefilled(Boolean(prefill.fullName && prefill.email));
        } else {
          setDraft((prev) => ({ ...prev, expectedSalary: formatRange(jobData) }));
        }
      } catch {
        if (!cancelled) toast.error("Could not open the application");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // Cleanup: if the user navigates away mid-load, don't set state on a
    // component that's no longer on screen.
    return () => {
      cancelled = true;
    };
  }, [jobId, navigate, isLoggedIn, authLoading]);

  function formatRange(j: Job): string {
    const fmt = (n: number) =>
      n >= 1_000_000
        ? `₦${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
        : `₦${Math.round(n / 1000)}k`;

    return `${fmt(j.salaryMin)} - ${fmt(j.salaryMax)}`;
  }

  async function handleCvUpload(file: File) {
    setUploadingCv(true);

    try {
      // Uploading here also updates their profile CV, which is what
      // "Upload a different CV for this role" implies — it becomes the
      // CV on file from now on.
      const profile = await uploadMyCv(file);

      update("cvUrl", profile.cvUrl);
      update("cvOriginalName", profile.cvOriginalName);
      toast.success("CV uploaded", profile.cvOriginalName);
    } catch (err) {
      toast.error(
        "Could not upload that CV",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setUploadingCv(false);
    }
  }

  // Each step decides for itself whether you're allowed to continue.
  function canContinue(): boolean {
    if (step === 0) {
      return Boolean(draft.fullName.trim() && draft.email.trim());
    }
    if (step === 2) {
      return Boolean(draft.whyThisRole.trim());
    }
    return true;
  }

  function goNext() {
    if (!canContinue()) {
      if (step === 0) toast.error("Name and email are required");
      if (step === 2) toast.error("Tell us why you're interested in this role");
      return;
    }

    setStep((s) => Math.min(s + 1, 3));
  }

  async function handleSubmit() {
    if (!jobId) return;

    setSubmitting(true);

    try {
      const result = await submitApplication(jobId, draft);
      setSubmittedId(result.applicationId);
    } catch (err) {
      toast.error(
        "Could not submit your application",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFB] font-['Inter'] text-[14px] text-[#4B4757]">
        Opening application…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#FAFAFB] px-4 text-center">
        <div className="font-['Bricolage_Grotesque'] font-bold text-[22px] text-[#161320]">
          This role isn't available
        </div>
        <NavLink
          to="/find-jobs"
          className="font-['Inter'] text-[14px] text-[#6D4AFF] hover:underline"
        >
          Back to all roles
        </NavLink>
      </div>
    );
  }

  // Once submitted, the wizard is done — show the confirmation instead.
  if (submittedId) {
    return <ApplySubmitted job={job} applicationId={submittedId} />;
  }

  return (
    <ApplyLayout job={job} currentStep={step}>
      <div className="mt-[24px] rounded-[22px] border-[1.07px] border-[#ECEBF0] bg-white p-6 sm:p-[30px]">
        {/* ---------------- STEP 1 — Your details ---------------- */}
        {step === 0 && (
          <>
            <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-[26px] leading-[34px] tracking-[-0.8px] text-[#161320]">
              Confirm your details
            </h1>
            <p className="mt-[6px] font-['Inter'] text-[13.5px] text-[#4B4757]">
              Straight from your profile — change anything that's out of date.
            </p>

            {prefilled && (
              <div className="mt-[16px] inline-flex items-center gap-[7px] rounded-full bg-[#F2EEFF] px-[12px] py-[6px] font-['Inter'] font-medium text-[11.5px] text-[#6D4AFF]">
                <FiCheck size={13} />
                Filled from your profile
              </div>
            )}

            <div className="mt-[22px] flex flex-col gap-[16px]">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  className={inputClass}
                  value={draft.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-[16px] sm:flex-row">
                <div className="flex-1">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={draft.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    value={draft.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  value={draft.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* ---------------- STEP 2 — CV & links ---------------- */}
        {step === 1 && (
          <>
            <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-[26px] leading-[34px] tracking-[-0.8px] text-[#161320]">
              CV &amp; links
            </h1>
            <p className="mt-[6px] font-['Inter'] text-[13.5px] text-[#4B4757]">
              Confirm what this company will see. Your profile CV is attached by
              default.
            </p>

            {/* The CV on file */}
            {draft.cvOriginalName ? (
              <div className="mt-[20px] flex items-center gap-[14px] rounded-[14px] border-[1.5px] border-[#6D4AFF] bg-[#F7F4FF] p-[14px]">
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#EDE7FF] text-[#6D4AFF]">
                  <FiFileText size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-['Inter'] font-semibold text-[13.5px] text-[#161320]">
                    {draft.cvOriginalName}
                  </div>
                  <div className="font-['Inter'] text-[11.5px] text-[#6D4AFF]">
                    Attached from your profile
                  </div>
                </div>

                {/* A filled dot showing this one is selected */}
                <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#6D4AFF]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#6D4AFF]" />
                </span>
              </div>
            ) : (
              <div className="mt-[20px] rounded-[14px] border-[1.07px] border-dashed border-[#ECEBF0] bg-[#FAFAFB] p-[18px] text-center font-['Inter'] text-[13px] text-[#4B4757]">
                No CV on your profile yet — upload one below.
              </div>
            )}

            {/* A hidden file input driven by a label, because the browser's
                default file picker button can't be styled. */}
            <label className="mt-[12px] inline-block cursor-pointer font-['Inter'] text-[12.5px] text-[#6D4AFF] underline">
              {uploadingCv
                ? "Uploading…"
                : "Upload a different CV for this role"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={uploadingCv}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCvUpload(file);
                }}
              />
            </label>

            <div className="mt-[22px] flex flex-col gap-[16px] sm:flex-row">
              <div className="flex-1">
                <label className={labelClass}>Portfolio link</label>
                <input
                  className={inputClass}
                  placeholder="yoursite.com"
                  value={draft.portfolioLink}
                  onChange={(e) => update("portfolioLink", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>LinkedIn</label>
                <input
                  className={inputClass}
                  placeholder="linkedin.com/in/you"
                  value={draft.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* ---------------- STEP 3 — Questions ---------------- */}
        {step === 2 && (
          <>
            <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-[26px] leading-[34px] tracking-[-0.8px] text-[#161320]">
              A few quick questions
            </h1>
            <p className="mt-[6px] font-['Inter'] text-[13.5px] text-[#4B4757]">
              Short and specific — this is what our team reads first.
            </p>

            <div className="mt-[22px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[16px] sm:flex-row">
                <div className="flex-1">
                  <label className={labelClass}>Years of relevant experience</label>
                  <select
                    className={inputClass}
                    value={draft.yearsOfExperience}
                    onChange={(e) => update("yearsOfExperience", e.target.value)}
                  >
                    <option value="">Select option</option>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className={labelClass}>When can you start?</label>
                  <select
                    className={inputClass}
                    value={draft.availability}
                    onChange={(e) => update("availability", e.target.value)}
                  >
                    <option value="">Select option</option>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Expected monthly salary (₦)</label>
                <input
                  className={inputClass}
                  value={draft.expectedSalary}
                  onChange={(e) => update("expectedSalary", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Why are you interested in this role?{" "}
                  <span className="text-[#D14343]">*</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={600}
                  placeholder="A sentence or two on why you're a strong fit."
                  value={draft.whyThisRole}
                  onChange={(e) => update("whyThisRole", e.target.value)}
                  className="w-full rounded-[12px] border-[1.05px] border-[#ECEBF0] bg-white p-[15px] font-['Inter'] text-[14px] leading-[22px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
                />
                {/* A live character count, so nobody hits the limit blind */}
                <div className="mt-[4px] text-right font-['Inter'] text-[11px] text-[#8B8798]">
                  {draft.whyThisRole.length} / 600
                </div>
              </div>
            </div>
          </>
        )}

        {/* ---------------- STEP 4 — Review & submit ---------------- */}
        {step === 3 && (
          <>
            <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-[26px] leading-[34px] tracking-[-0.8px] text-[#161320]">
              Review &amp; submit
            </h1>
            <p className="mt-[6px] font-['Inter'] text-[13.5px] text-[#4B4757]">
              Here's exactly what the WorkNest team will see.
            </p>

            <div className="mt-[22px] flex flex-col gap-[16px]">
              <ReviewCard
                title="Your details"
                onEdit={() => setStep(0)}
                rows={[
                  ["Name", draft.fullName],
                  ["Email", draft.email],
                  ["Phone", draft.phone],
                  ["Location", draft.location],
                ]}
              />

              <ReviewCard
                title="CV & links"
                onEdit={() => setStep(1)}
                rows={[
                  ["CV", draft.cvOriginalName],
                  ["Portfolio", draft.portfolioLink],
                  ["LinkedIn", draft.linkedin],
                ]}
              />

              <ReviewCard
                title="Your answers"
                onEdit={() => setStep(2)}
                rows={[
                  ["Experience", draft.yearsOfExperience],
                  ["Can start", draft.availability],
                  ["Expected salary", draft.expectedSalary],
                  ["Why this role", draft.whyThisRole],
                ]}
              />

              {/* The promise the whole product is built on */}
              <div className="rounded-[16px] bg-[#140A28] p-5">
                <span className="font-['Inter'] font-semibold text-[9.5px] tracking-[0.6px] uppercase text-[#FFC93C]">
                  Reviewed by a human
                </span>
                <p className="mt-[10px] font-['Inter'] text-[13px] leading-[21px] text-[hsla(0,0%,100%,0.72)]">
                  Once you submit, a real person on our team reads your
                  application, scores it against this role, and updates you
                  either way — no black hole.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer buttons — same row on every step, different labels */}
      <div className="mt-[22px] flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[26px] py-[11px] font-['Inter'] font-medium text-[13.5px] text-[#161320]"
          >
            Back
          </button>
        ) : (
          // An empty span keeps "Continue" pushed to the right on step 1,
          // where there's no Back button to balance it.
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-[#6D4AFF] px-[30px] py-[12px] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)]"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-[#6D4AFF] px-[30px] py-[12px] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)] disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </ApplyLayout>
  );
};

// ---------------------------------------------------------------------------
// One summary card on the review step. Kept here rather than in its own file
// because nothing outside this page uses it.
// ---------------------------------------------------------------------------
type ReviewCardProps = {
  title: string;
  onEdit: () => void;
  rows: [string, string][];
};

const ReviewCard = ({ title, onEdit, rows }: ReviewCardProps) => (
  <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] p-[18px]">
    <div className="flex items-center justify-between border-b border-[#F2F1F6] pb-[12px]">
      <span className="font-['Inter'] font-semibold text-[10.5px] tracking-[1.2px] uppercase text-[#8B8798]">
        {title}
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="font-['Inter'] text-[12.5px] text-[#6D4AFF] underline"
      >
        Edit
      </button>
    </div>

    <div className="mt-[12px] flex flex-col gap-[10px]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4">
          <span className="shrink-0 font-['Inter'] text-[13px] text-[#8B8798]">
            {label}
          </span>
          {/* An em dash when a field was left blank, so the row still reads
              as intentional rather than looking broken. */}
          <span className="text-right font-['Inter'] font-medium text-[13px] text-[#161320]">
            {value?.trim() ? value : "—"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Apply;
