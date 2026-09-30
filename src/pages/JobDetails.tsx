import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SaveJobButton from "../components/SaveJobButton";
import ApplyGateModal from "../components/ApplyGateModal";
import { fetchJobById } from "../api/jobs";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../types/job";

const formatSalary = (amount: number, currency: string) =>
  amount >= 1_000_000
    ? `${currency}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    : `${currency}${Math.round(amount / 1000)}k`;

const JobDetails = () => {
  // Reads the ":jobId" part of the URL, e.g. /job-details/6a94cf...
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyGate, setShowApplyGate] = useState(false);

  // Logged in — go straight to the wizard, same as always. Logged out —
  // show the modal instead of the ProtectedRoute redirect this used to be.
  function handleApplyClick() {
    if (isLoggedIn) {
      navigate(`/apply/${jobId}`);
    } else {
      setShowApplyGate(true);
    }
  }

  // Runs on load, AND again whenever jobId changes — because [jobId] is the
  // dependency array. Without jobId in there, clicking a different job would
  // keep showing the old one.
  useEffect(() => {
    if (!jobId) return;

    setLoading(true);
    fetchJobById(jobId)
      .then((data) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />
        <div className="py-24 text-center font-['Inter'] text-[14px] text-[#4B4757]">
          Loading role…
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />
        <div className="py-24 text-center">
          <div className="font-['Bricolage_Grotesque'] font-bold text-[24px] text-[#161320]">
            This role isn't available
          </div>
          <p className="mt-2 font-['Inter'] text-[14px] text-[#4B4757]">
            It may have closed, or the link might be wrong.
          </p>
          <NavLink
            to="/find-jobs"
            className="mt-5 inline-block font-['Inter'] text-[14px] text-[#6D4AFF] hover:underline"
          >
            Back to all roles
          </NavLink>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    companyName,
    companyLogo,
    title,
    description,
    location,
    workArrangement,
    jobType,
    experienceLevel,
    careerPath,
    salaryMin,
    salaryMax,
    currency = "₦",
    closesInDays,
    postedDaysAgo,
    whyThisCouldFit,
    responsibilities,
    requirements,
    skills,
  } = job;


  console.log(job)

  const tags = [
    location,
    workArrangement,
    jobType,
    experienceLevel,
    careerPath,
  ];

  const meta = [
    { label: "Employment", value: jobType },
    { label: "Level", value: experienceLevel },
    { label: "Arrangement", value: workArrangement },
    { label: "Location", value: location },
    {
      label: "Posted",
      value: `${postedDaysAgo} ${postedDaysAgo === 1 ? "day" : "days"} ago`,
    },
  ];

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />

        {/* Back link */}
        <NavLink
          to="/find-jobs"
          className="mt-10 lg:mt-[52px] inline-flex items-center gap-[7px] font-['Inter'] text-[13px] text-[#8B8798] transition hover:text-[#161320]"
        >
          <FiArrowLeft size={14} />
          Back to all roles
        </NavLink>

        {/* Hero */}
        <div className="mt-4 lg:mt-[18px] rounded-[24px] bg-[#F2EEFF] p-6 lg:p-[32px]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-[12px]">
              <img
                className="h-[45px] w-[45px] shrink-0 rounded-[9px]"
                src={companyLogo}
                alt={companyName}
              />
              <div>
                <div className="font-['Inter'] font-normal text-[11.2px] leading-[16.8px] tracking-[0.45px] text-[#6D4AFF]">
                  Hiring for
                </div>
                <div className="font-['Inter'] font-semibold text-[14.94px] leading-[22.4px] text-[#161320]">
                  {companyName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              <SaveJobButton
                jobId={job.id}
                jobTitle={job.title}
                variant="circle"
              />
              <button
                type="button"
                onClick={handleApplyClick}
                className="flex h-[38px] items-center rounded-full bg-[#6D4AFF] px-[22px] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.25)]"
              >
                Apply now
              </button>
            </div>
          </div>

          <h1 className="mt-5 lg:mt-[22px] font-['Bricolage_Grotesque'] font-extrabold text-3xl lg:text-[36px] leading-tight lg:leading-[42px] tracking-[-1px] text-[#161320]">
            {title}
          </h1>

          <div className="mt-4 lg:mt-[18px] flex flex-wrap gap-[8px]">
            {tags.map((tag, i) => (
              <div
                key={`${tag}-${i}`}
                className="flex h-[32px] items-center justify-center whitespace-nowrap rounded-full border-[1.07px] border-[#E3DCFF] bg-white/70 px-[13px] font-['Inter'] text-[12.5px] text-[#4B4757]"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 lg:mt-[40px] mb-24 lg:mb-[120px] flex flex-col lg:flex-row gap-8 lg:gap-[48px]">
          {/* Left column */}
          <div className="min-w-0 flex-1">
            <h2 className="font-['Bricolage_Grotesque'] font-bold text-[20px] leading-[30px] tracking-[-0.4px] text-[#161320]">
              About the role
            </h2>
            <p className="mt-[10px] font-['Inter'] text-[14px] leading-[24px] text-[#4B4757]">
              {description}
            </p>

            <h2 className="mt-8 lg:mt-[38px] font-['Bricolage_Grotesque'] font-bold text-[20px] leading-[30px] tracking-[-0.4px] text-[#161320]">
              What you'll do
            </h2>
            <ul className="mt-[14px] flex flex-col gap-[12px]">
              {responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#6D4AFF]" />
                  <span className="font-['Inter'] text-[14px] leading-[22px] text-[#4B4757]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 lg:mt-[38px] font-['Bricolage_Grotesque'] font-bold text-[20px] leading-[30px] tracking-[-0.4px] text-[#161320]">
              What we're looking for
            </h2>
            <ul className="mt-[14px] flex flex-col gap-[12px]">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#6D4AFF]" />
                  <span className="font-['Inter'] text-[14px] leading-[22px] text-[#4B4757]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 lg:mt-[38px] font-['Bricolage_Grotesque'] font-bold text-[20px] leading-[30px] tracking-[-0.4px] text-[#161320]">
              Skills
            </h2>
            <div className="mt-[14px] flex flex-wrap gap-[8px]">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex h-[35.4px] items-center justify-center whitespace-nowrap rounded-full border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] px-[12.8px] font-['Inter'] text-[13px] text-[#4B4757]"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="w-full lg:w-[268px] lg:shrink-0 flex flex-col gap-4 lg:gap-[18px]">
            <div className="rounded-[20px] border-[1.07px] border-[#ECEBF0] bg-white p-5 lg:p-[22px] shadow-[0px_1.07px_3.2px_0px_#1613200F,0px_1.07px_2.13px_0px_#1613200D]">
              <div className="font-['Bricolage_Grotesque'] font-bold text-[21px] leading-[30px] tracking-[-0.4px] text-[#161320]">
                {formatSalary(salaryMin, currency)}–
                {formatSalary(salaryMax, currency)}{" "}
                <span className="font-['Inter'] font-medium text-[11.5px] text-[#8B8798]">
                  /mo
                </span>
              </div>

              <div className="mt-[6px] font-['Inter'] text-[11.5px] text-[#8A5A12]">
                {closesInDays === 0
                  ? "Closes today"
                  : `Closes in ${closesInDays} ${closesInDays === 1 ? "day" : "days"}`}
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="mt-[18px] flex h-[42px] w-full items-center justify-center rounded-full bg-[#6D4AFF] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.25)]"
              >
                Apply now
              </button>
              <button
                type="button"
                className="mt-[10px] h-[42px] w-full rounded-full bg-[#EFEAFF] font-['Inter'] font-semibold text-[13.5px] text-[#6D4AFF]"
              >
                Save for later
              </button>

              <div className="mt-[20px] flex flex-col gap-[12px] border-t-[1.07px] border-t-[#F2F1F6] pt-[18px]">
                {meta.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-['Inter'] text-[12.5px] text-[#8B8798]">
                      {row.label}
                    </span>
                    <span className="font-['Inter'] font-medium text-[12.5px] text-[#161320]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why this could fit */}
            <div className="rounded-[20px] border-[1.07px] border-[#FFE7A3] bg-[#FFFCF2] p-5">
              <span className="inline-block rounded-full bg-[#FFC93C] px-[10px] py-[4px] font-['Inter'] font-semibold text-[9.5px] tracking-[0.6px] uppercase text-[#463400]">
                Why this could fit
              </span>
              <div className="mt-[14px] flex items-start gap-[9px]">
                <FiCheck
                  className="mt-[2px] shrink-0 text-[#8A5A12]"
                  size={14}
                />
                <span className="font-['Inter'] text-[12.5px] leading-[20px] text-[#4B4757]">
                  {whyThisCouldFit}
                </span>
              </div>
            </div>

            {/* Reviewed by a human */}
            <div className="rounded-[20px] bg-[#140A28] p-5">
              <span className="font-['Inter'] font-semibold text-[9.5px] tracking-[0.6px] uppercase text-[#FFC93C]">
                Reviewed by a human
              </span>
              <p className="mt-[12px] font-['Inter'] text-[12.5px] leading-[20px] text-[hsla(0,0%,100%,0.68)]">
                When you apply, a real person on our team reads it, scores it
                against this role, and updates you either way — no black hole.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {showApplyGate && (
        <ApplyGateModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowApplyGate(false)}
        />
      )}
    </>
  );
};

export default JobDetails;
