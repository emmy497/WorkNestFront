import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiCheck,
  FiCalendar,
  FiUserCheck,
  FiDownload,
} from "react-icons/fi";
import type { AdminOutletContext } from "../AdminLayout";
import StatCard from "./StatCard";
import RecentApplications from "./RecentApplications";
import ApplicationsByStatus from "./ApplicationsByStatus";
import JobsClosingSoon from "./JobsClosingSoon";
import MostAppliedRoles from "./MostAppliedRoles";
import PipelineSnapshot from "./PipelineSnapshot";

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Overview = () => {
  const { overview, loading, error } = useOutletContext<AdminOutletContext>();

  if (loading) {
    return (
      <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[48px] text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
        Loading the dashboard…
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="rounded-[16px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-[48px] text-center">
        <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
          Something went wrong
        </div>
        <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
          {error || "Could not load the dashboard."}
        </p>
      </div>
    );
  }

  const { stats } = overview;

  return (
    <div>
      <div className="mb-[28px] flex flex-wrap items-start justify-between gap-[12px]">
        <div>
          <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
            DASHBOARD
          </div>
          <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[32px] text-[#161320]">
            Overview
          </h1>
          <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">
            {TODAY} · here's where hiring stands today.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Coming soon!")}
          className="flex shrink-0 items-center gap-[8px] rounded-[10px] border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-[#4B4757] hover:bg-[#FAFAFB]"
        >
          <FiDownload className="size-[15px]" />
          Export
        </button>
      </div>

      <div className="mb-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Active jobs"
          stat={stats.activeJobs}
          icon={FiBriefcase}
          iconBg="#F1EDFF"
          iconColor="#6D4AFF"
        />
        <StatCard
          label="Registered candidates"
          stat={stats.registeredCandidates}
          icon={FiUsers}
          iconBg="#EAF1FF"
          iconColor="#2F6FE4"
        />
        <StatCard
          label="Applications received"
          stat={stats.applicationsReceived}
          icon={FiFileText}
          iconBg="#FFF4E8"
          iconColor="#C6531B"
        />
        <StatCard
          label="Shortlisted"
          stat={stats.shortlisted}
          icon={FiCheck}
          iconBg="#F1EDFF"
          iconColor="#6D4AFF"
        />
        <StatCard
          label="Interviews scheduled"
          stat={stats.interviewsScheduled}
          icon={FiCalendar}
          iconBg="#EAF1FF"
          iconColor="#2F6FE4"
        />
        <StatCard
          label="Placements made"
          stat={stats.placementsMade}
          icon={FiUserCheck}
          iconBg="#EAFBEF"
          iconColor="#1E7B34"
        />
      </div>

      <div className="mb-[24px] grid grid-cols-1 gap-[16px] xl:grid-cols-[1fr_360px]">
        <RecentApplications applications={overview.recentApplications} />
        <div className="flex flex-col gap-[16px]">
          <ApplicationsByStatus breakdown={overview.applicationsByStatus} />
          <JobsClosingSoon jobs={overview.jobsClosingSoon} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-2">
        <MostAppliedRoles roles={overview.mostAppliedRoles} />
        <PipelineSnapshot pipeline={overview.pipeline} />
      </div>
    </div>
  );
};

export default Overview;
