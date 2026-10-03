import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiX } from "react-icons/fi";
import type {
  CareerPath,
  CompanyOption,
  ExperienceLevel,
  JobType,
  WorkArrangement,
} from "../../types/job";
import { fetchCompanies } from "../../api/adminCompanies";
import { createJob } from "../../api/adminJobs";
import SkillsInput from "../../components/SkillsInput";
import { toast } from "../../lib/toast";

const WORK_ARRANGEMENTS: WorkArrangement[] = ["Remote", "Hybrid", "Onsite"];
const JOB_TYPES: JobType[] = ["Full-time", "Contract", "Internship", "Part-time"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Junior", "Mid-level", "Senior"];
const CAREER_PATHS: CareerPath[] = ["Design", "Engineering", "Data", "Customer", "Marketing"];

const inputClass =
  "w-full h-[44px] rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white px-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]";

const labelClass = "mb-[8px] block font-['Inter'] text-[13px] font-medium text-[#4B4757]";

// Swaps the border color wholesale rather than appending a second border
// class alongside it — two border-color utilities on one element race each
// other in the generated CSS, so only one variant of the string is ever used.
function fieldClass(hasError: boolean): string {
  return hasError
    ? inputClass
        .replace("border-[#ECEBF0]", "border-[#D14343]")
        .replace("focus:border-[#6D4AFF]", "focus:border-[#D14343]")
    : inputClass;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-[6px] font-['Inter'] text-[12px] text-[#D14343]">{message}</p>;
}

type FormState = {
  title: string;
  companyId: string;
  location: string;
  workArrangement: WorkArrangement | "";
  jobType: JobType | "";
  experienceLevel: ExperienceLevel | "";
  careerPath: CareerPath | "";
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  salaryMin: string;
  salaryMax: string;
  numberOfPositions: string;
  closesAt: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  companyId: "",
  location: "",
  workArrangement: "",
  jobType: "",
  experienceLevel: "",
  careerPath: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: [],
  salaryMin: "",
  salaryMax: "",
  numberOfPositions: "1",
  closesAt: "",
};

// A pill group acting as a single-select — same look every status/filter
// pill in this app already uses.
function PillGroup<T extends string>({
  options,
  value,
  onChange,
  hasError,
}: {
  options: T[];
  value: T | "";
  onChange: (value: T) => void;
  hasError?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap gap-[8px] rounded-[14px] ${
        hasError ? "border-[1.07px] border-[#D14343] p-[6px]" : ""
      }`}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border-[1.07px] px-[16px] py-[9px] font-['Inter'] text-[13.5px] font-medium transition-colors ${
            value === option
              ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
              : "border-[#ECEBF0] text-[#4B4757] hover:border-[#D8D3F0]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

const JobEditor = () => {
  const navigate = useNavigate();

  // The Client detail page's "New role" button sends its company id along
  // so the form opens already scoped to that client instead of making the
  // admin pick it again from the dropdown.
  const location = useLocation();
  const preselectedCompanyId = (location.state as { companyId?: string } | null)?.companyId ?? "";

  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, companyId: preselectedCompanyId });
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tracks WHICH action is in flight, so the other button can stay enabled
  // (not strictly needed, but disabling only the one that was clicked reads
  // better than freezing the whole form).
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);

  useEffect(() => {
    fetchCompanies()
      .then(setCompanies)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load clients"))
      .finally(() => setCompaniesLoading(false));
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  }

  function addScreeningQuestion() {
    setScreeningQuestions((prev) => [...prev, ""]);
  }

  function updateScreeningQuestion(index: number, value: string) {
    setScreeningQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  }

  function removeScreeningQuestion(index: number) {
    setScreeningQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};

    if (!form.title.trim()) next.title = "Job title is required";
    if (!form.companyId) next.companyId = "Choose a client";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.workArrangement) next.workArrangement = "Choose a work arrangement";
    if (!form.jobType) next.jobType = "Choose a job type";
    if (!form.experienceLevel) next.experienceLevel = "Choose an experience level";
    if (!form.careerPath) next.careerPath = "Choose a career path";
    if (!form.description.trim()) next.description = "Add a short description of the role";
    if (!form.salaryMin) next.salaryMin = "Enter a minimum salary";
    if (!form.salaryMax) next.salaryMax = "Enter a maximum salary";
    if (!form.closesAt) next.closesAt = "Set an application deadline";

    return next;
  }

  async function handleSubmit(action: "draft" | "publish") {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(action);

    try {
      const { jobId } = await createJob({
        title: form.title.trim(),
        companyId: form.companyId,
        location: form.location.trim(),
        // validate() above already guarantees these are non-empty — the
        // casts just tell TypeScript what it can't infer across functions.
        workArrangement: form.workArrangement as WorkArrangement,
        jobType: form.jobType as JobType,
        experienceLevel: form.experienceLevel as ExperienceLevel,
        careerPath: form.careerPath as CareerPath,
        description: form.description.trim(),
        responsibilities: form.responsibilities
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        skills: form.skills,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        numberOfPositions: Number(form.numberOfPositions) || 1,
        closesAt: form.closesAt,
        screeningQuestions: screeningQuestions.map((q) => q.trim()).filter(Boolean),
        action,
      });

      toast.success(action === "publish" ? "Role published" : "Saved as draft");
      navigate("/admin/jobs");
      void jobId;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create this job");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="mx-auto max-w-[920px]">
      <NavLink
        to="/admin/jobs"
        className="mb-[16px] inline-flex items-center gap-[7px] font-['Inter'] text-[13px] text-[#8B8798] hover:text-[#161320]"
      >
        <FiArrowLeft size={14} />
        Back to jobs
      </NavLink>

      <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
        JOB EDITOR
      </div>
      <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[32px] text-[#161320]">
        New role
      </h1>
      <p className="mb-[24px] font-['Inter'] text-[13.5px] text-[#8B8798]">
        Create and publish a role for a client.
      </p>

      {/* Section 1 — Basics */}
      <Section number={1} title="Basics">
        <div>
          <label className={labelClass}>Job title</label>
          <input
            className={fieldClass(Boolean(errors.title))}
            placeholder="e.g. Product Designer"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <FieldError message={errors.title} />
        </div>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div>
            <label className={labelClass}>Client</label>
            <select
              className={fieldClass(Boolean(errors.companyId))}
              value={form.companyId}
              onChange={(e) => update("companyId", e.target.value)}
            >
              <option value="">
                {companiesLoading ? "Loading clients…" : "Select a client…"}
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.companyId} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={fieldClass(Boolean(errors.location))}
              placeholder="Lagos, Nigeria"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
            <FieldError message={errors.location} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Work arrangement</label>
          <PillGroup
            options={WORK_ARRANGEMENTS}
            value={form.workArrangement}
            onChange={(value) => update("workArrangement", value)}
            hasError={Boolean(errors.workArrangement)}
          />
          <FieldError message={errors.workArrangement} />
        </div>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div>
            <label className={labelClass}>Job type</label>
            <PillGroup
              options={JOB_TYPES}
              value={form.jobType}
              onChange={(value) => update("jobType", value)}
              hasError={Boolean(errors.jobType)}
            />
            <FieldError message={errors.jobType} />
          </div>
          <div>
            <label className={labelClass}>Experience level</label>
            <select
              className={fieldClass(Boolean(errors.experienceLevel))}
              value={form.experienceLevel}
              onChange={(e) => update("experienceLevel", e.target.value as ExperienceLevel)}
            >
              <option value="">Select…</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <FieldError message={errors.experienceLevel} />
          </div>
        </div>

        <div>
          {/* Not in the mockup — the Job model requires a career path, and
              the public Find Jobs filter sorts by it, so a real value is
              needed here rather than a guessed default. */}
          <label className={labelClass}>Career path</label>
          <select
            className={fieldClass(Boolean(errors.careerPath))}
            value={form.careerPath}
            onChange={(e) => update("careerPath", e.target.value as CareerPath)}
          >
            <option value="">Select…</option>
            {CAREER_PATHS.map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
          <FieldError message={errors.careerPath} />
        </div>
      </Section>

      {/* Section 2 — Role details */}
      <Section number={2} title="Role details">
        <div>
          <label className={labelClass}>About the role</label>
          <textarea
            rows={3}
            placeholder="A short overview of what this role is about."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={`w-full resize-none rounded-[12px] border-[1.07px] bg-white p-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] ${
              errors.description
                ? "border-[#D14343] focus:border-[#D14343]"
                : "border-[#ECEBF0] focus:border-[#6D4AFF]"
            }`}
          />
          <FieldError message={errors.description} />
        </div>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Responsibilities <span className="text-[#8B8798]">(one per line)</span>
            </label>
            <textarea
              rows={4}
              placeholder={"Design core flows end to end\nPartner with engineers to ship"}
              value={form.responsibilities}
              onChange={(e) => update("responsibilities", e.target.value)}
              className="w-full resize-none rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white p-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
            />
          </div>
          <div>
            <label className={labelClass}>
              Requirements <span className="text-[#8B8798]">(one per line)</span>
            </label>
            <textarea
              rows={4}
              placeholder={"3+ years of experience\nA strong portfolio"}
              value={form.requirements}
              onChange={(e) => update("requirements", e.target.value)}
              className="w-full resize-none rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white p-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Required skills</label>
          <SkillsInput value={form.skills} onChange={(skills) => update("skills", skills)} />
        </div>
      </Section>

      {/* Section 3 — Compensation & logistics */}
      <Section number={3} title="Compensation & logistics">
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div>
            <label className={labelClass}>Salary min (₦ / month)</label>
            <input
              type="number"
              className={fieldClass(Boolean(errors.salaryMin))}
              placeholder="650000"
              value={form.salaryMin}
              onChange={(e) => update("salaryMin", e.target.value)}
            />
            <FieldError message={errors.salaryMin} />
          </div>
          <div>
            <label className={labelClass}>Salary max (₦ / month)</label>
            <input
              type="number"
              className={fieldClass(Boolean(errors.salaryMax))}
              placeholder="900000"
              value={form.salaryMax}
              onChange={(e) => update("salaryMax", e.target.value)}
            />
            <FieldError message={errors.salaryMax} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div>
            <label className={labelClass}>Number of positions</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.numberOfPositions}
              onChange={(e) => update("numberOfPositions", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Application deadline</label>
            <input
              type="date"
              className={fieldClass(Boolean(errors.closesAt))}
              value={form.closesAt}
              onChange={(e) => update("closesAt", e.target.value)}
            />
            <FieldError message={errors.closesAt} />
          </div>
        </div>
      </Section>

      {/* Section 4 — Screening questions */}
      <Section number={4} title="Screening questions">
        {screeningQuestions.length === 0 ? (
          <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">
            No screening questions yet.
          </p>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {screeningQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-[10px]">
                <input
                  className={inputClass}
                  placeholder="e.g. Why are you interested in this role?"
                  value={question}
                  onChange={(e) => updateScreeningQuestion(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeScreeningQuestion(index)}
                  aria-label="Remove question"
                  className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#C62828]"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addScreeningQuestion}
          className="mt-[12px] inline-flex items-center gap-[8px] rounded-full border-[1.07px] border-dashed border-[#C9BBFF] px-[16px] py-[9px] font-['Inter'] text-[13.5px] font-semibold text-[#6D4AFF] hover:bg-[#FAFAFB]"
        >
          <FiPlus size={14} />
          Add a question
        </button>
      </Section>

      {/* bottom bar */}
      <div className="mt-[8px] flex flex-wrap items-center justify-between gap-[12px] pb-[40px]">
        <button
          type="button"
          onClick={() => navigate("/admin/jobs")}
          className="rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[22px] py-[11px] font-['Inter'] font-medium text-[13.5px] text-[#161320]"
        >
          Cancel
        </button>

        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={submitting !== null}
            className="rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[22px] py-[11px] font-['Inter'] font-semibold text-[13.5px] text-[#161320] disabled:opacity-60"
          >
            {submitting === "draft" ? "Saving…" : "Save as draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("publish")}
            disabled={submitting !== null}
            className="rounded-full bg-[#6D4AFF] px-[22px] py-[11px] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.25)] disabled:opacity-60"
          >
            {submitting === "publish" ? "Publishing…" : "Publish role"}
          </button>
        </div>
      </div>
    </div>
  );
};

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-[20px] rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px] sm:p-[26px]">
      <div className="mb-[20px] flex items-center gap-[10px]">
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#F1EDFF] font-['Inter'] text-[12px] font-bold text-[#6D4AFF]">
          {number}
        </span>
        <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-[18px]">{children}</div>
    </div>
  );
}

export default JobEditor;
