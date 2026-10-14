import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { fetchJobs } from "../../api/jobs";
import type { Job } from "../../types/job";

const OpenThisWeek = () => {
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchJobs()
      .then((data) => {
        if (!cancelled) setJobs(data.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
      {jobs === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[24px]">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-[16px] bg-[#F4F2FA]" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="py-10 text-center font-['Inter'] text-[14px] text-[#4B4757]">
          No open roles right now.{" "}
          <Link to="/find-jobs" className="text-[#6D4AFF] underline">
            Browse all jobs
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[24px]">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showDescription={false}
              showSaveButton={false}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default OpenThisWeek;
