import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SearchBar, { ANY_LOCATION } from "../components/SearchBar";
import JobCard from "../components/JobCard";
import JobFilters, {
  emptyFilters,
  type FilterKey,
  type SelectedFilters,
} from "../components/JobFilters";
import { fetchJobs } from "../api/jobs";
import type { Job } from "../types/job";

type SortOption = "newest" | "closing" | "salary";

const FindJobs = () => {
  const [selected, setSelected] = useState<SelectedFilters>(emptyFilters);
  const [sort, setSort] = useState<SortOption>("newest");

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? ANY_LOCATION;

  function setSearchParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);

    if (value) next.set(key, value);
    else next.delete(key);

    setSearchParams(next, { replace: true });
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs()
      .then((data) => setJobs(data))
      .catch(() => setError("Could not load jobs. Is the API server running?"))
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (key: FilterKey, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearAll = () => {
    setSelected(emptyFilters);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const locations = [...new Set(jobs.map((job) => job.location))].sort();

  function matchesQuery(job: Job): boolean {
    if (!query.trim()) return true;

    const needle = query.trim().toLowerCase();

    const haystack = [job.title, job.companyName, ...job.skills]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  }

  const visibleJobs = jobs
    .filter((job) =>
      (Object.keys(selected) as FilterKey[]).every(
        (key) => selected[key].length === 0 || selected[key].includes(job[key]),
      ),
    )
    .filter(matchesQuery)
    .filter((job) => location === ANY_LOCATION || job.location === location)
    .sort((a, b) => {
      if (sort === "closing") return a.closesInDays - b.closesInDays;
      if (sort === "salary") return b.salaryMax - a.salaryMax;
      return 0;
    });

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />

        <div className="w-full pt-[43px] pb-[8px] mb-12 lg:mb-[69px]">
          <div className="mb-[12px] font-['Inter'] font-medium text-[11.5px] leading-[17.25px] tracking-[1.61px] uppercase text-[#6D4AFF]">
            Find jobs
          </div>
          <div className="mb-[10px] font-['Bricolage_Grotesque'] font-extrabold text-4xl lg:text-[50px] leading-tight lg:leading-[50px] tracking-tight lg:tracking-[-1.75px] text-[#161320]">
            Open roles
          </div>
          <div className="mb-[28px] font-['Inter'] text-base lg:text-[16px] leading-[24px] text-[#4B4757]">
            Every role below is a company actively hiring — reviewed and
            shortlisted by our team.
          </div>

          <SearchBar
            query={query}
            onQueryChange={(value) => setSearchParam("q", value)}
            location={location}
            onLocationChange={(value) => setSearchParam("location", value)}
            locations={locations}
          />
        </div>

        <section className="flex flex-col lg:flex-row gap-6 lg:gap-[24px] mb-24 lg:mb-[140px]">
          <JobFilters
            jobs={jobs}
            selected={selected}
            onToggle={toggleFilter}
            onClearAll={clearAll}
            resultCount={visibleJobs.length}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
              <div className="font-['Inter'] text-[13px] text-[#4B4757]">
                <span className="font-semibold text-[#161320]">
                  {visibleJobs.length}
                </span>{" "}
                {visibleJobs.length === 1 ? "role" : "roles"} open
              </div>

              <div className="flex items-center gap-[10px]">
                <span className="font-['Inter'] font-medium text-[10px] tracking-[1.2px] uppercase text-[#8B8798]">
                  Sort
                </span>

                <div className="px-[14px] py-[10px]  rounded-[1062.51px] border-[1.07px] border-[#ECEBF0] bg-white  py-[10px] font-['Inter'] text-[12.5px] text-[#4B4757] outline-none focus:border-[#6D4AFF] ">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className=""
                  >
                    <option value="newest">Newest</option>
                    <option value="closing">Closing soon</option>
                    <option value="salary">Highest salary</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
                Loading roles…
              </div>
            ) : error ? (
              <div className="rounded-[24px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  Something went wrong
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  {error}
                </p>
              </div>
            ) : visibleJobs.length === 0 ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  {query
                    ? `No roles match "${query}"`
                    : "No roles match those filters"}
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  Try a different search, or remove a filter to see more roles.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 font-['Inter'] text-[13px] text-[#6D4AFF] hover:underline"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-[22px]">
                {visibleJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Cta />

      <Footer />
    </>
  );
};

export default FindJobs;
