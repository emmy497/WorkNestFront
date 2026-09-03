import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
  // When these are passed in, the parent owns the values (a "controlled"
  // component) — that's how FindJobs filters as you type.
  query?: string;
  onQueryChange?: (value: string) => void;

  location?: string;
  onLocationChange?: (value: string) => void;

  // The list of places to choose from, built from the jobs we actually have.
  locations?: string[];
};

// "All locations" is the do-nothing option. We use an empty string for it so
// that "no location chosen" and "" mean the same thing everywhere.
export const ANY_LOCATION = "";

const SearchBar = ({
  query,
  onQueryChange,
  location,
  onLocationChange,
  locations = ["Lagos", "Abuja", "Remote"],
}: SearchBarProps) => {
  const navigate = useNavigate();

  // If the parent didn't pass values in (like on the Home page), the
  // SearchBar keeps its own. Submitting then jumps to the jobs page.
  const [ownQuery, setOwnQuery] = useState("");
  const [ownLocation, setOwnLocation] = useState(ANY_LOCATION);

  const isControlled = onQueryChange !== undefined;

  const currentQuery = isControlled ? (query ?? "") : ownQuery;
  const currentLocation = isControlled ? (location ?? "") : ownLocation;

  function handleQueryChange(value: string) {
    if (isControlled) onQueryChange?.(value);
    else setOwnQuery(value);
  }

  function handleLocationChange(value: string) {
    if (isControlled) onLocationChange?.(value);
    else setOwnLocation(value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // On FindJobs the list already updates as you type, so there's nothing
    // left to do here.
    if (isControlled) return;

    // On the Home page, send the search over to the jobs page.
    // URLSearchParams builds "?q=react&location=Lagos" safely, escaping
    // spaces and special characters for us.
    const params = new URLSearchParams();
    if (ownQuery.trim()) params.set("q", ownQuery.trim());
    if (ownLocation) params.set("location", ownLocation);

    navigate(`/find-jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[560px] h-auto flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg shadow-violet-100 lg:mt-[24px] lg:h-[60px] lg:flex-row lg:items-center lg:gap-3 lg:rounded-full lg:py-[8px]"
    >
      {/* Job title / skill / company */}
      <div className="flex items-center w-full gap-3 border-b border-gray-100 lg:w-[312px] lg:border-b-0 lg:pl-[24px]">
        <img src="/images/search.png" alt="" />
        <input
          type="text"
          placeholder="Job title, skill, or company"
          value={currentQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="flex-1 border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none font-[inter] p-4"
        />
      </div>

      {/* Vertical divider — desktop only */}
      <div className="hidden h-6 w-px shrink-0 bg-gray-200 lg:block" />

      {/* Location */}
      <div className="flex shrink-0 items-center gap-1.5 text-sm text-gray-700">
        <img className="w-[14px]" src="/images/location.png" alt="location" />
        <select
          value={currentLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="cursor-pointer border-none bg-transparent text-sm text-gray-700 outline-none font-[inter]"
        >
          <option value={ANY_LOCATION}>Anywhere</option>
          {locations.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
      </div>

      {/* Search button — full width on mobile, auto width on desktop */}
      <button
        type="submit"
        className="w-full shrink-0 rounded-full bg-[#6D4AFF] px-7 py-2.5 text-sm font-semibold text-white transition ml-auto lg:w-auto"
      >
        <span className="lg:hidden">Search Jobs</span>
        <span className="hidden lg:inline">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
