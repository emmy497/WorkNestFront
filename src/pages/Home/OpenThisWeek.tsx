import JobCard from "../../components/JobCard";
import { mockJobs } from "../../Data/mockJobs";

const OpenThisWeek = () => {
  const jobs = mockJobs.slice(0, 6);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
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
    </section>
  );
};

export default OpenThisWeek;
