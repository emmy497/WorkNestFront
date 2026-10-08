import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { CandidateListItem, CandidateStatus } from "../../types/candidate";
import { fetchCandidates } from "../../api/adminCandidates";

const AVATAR_COLORS = ["#161320", "#2D5BFF", "#6D4AFF", "#1E9E5A", "#C2760C", "#D9651B"];

const EXPERIENCE_OPTIONS = ["Junior", "Mid-level", "Senior"];
const AVAILABILITY_OPTIONS = ["Immediately", "2 weeks notice", "1 month notice", "Open to discuss"];

const STATUS_STYLES: Record<CandidateStatus, { label: string; pill: string; dot: string }> = {
  placed: { label: "Placed", pill: "bg-[#F1EDFF] text-[#6D4AFF]", dot: "bg-[#6D4AFF]" },
  open: { label: "Open to work", pill: "bg-[#EAF6EF] text-[#1E7A4A]", dot: "bg-[#1E9E5A]" },
  employed: { label: "Employed", pill: "bg-[#F1F1F4] text-[#4B4757]", dot: "bg-[#B4B1BE]" },
};

const MAX_SKILLS = 3;

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[Math.abs(hash)];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function subtitle(candidate: CandidateListItem): string {
  const years = candidate.yearsOfExperience.replace(/\s*years?$/i, "");
  return [candidate.headline, years && `${years}y`].filter(Boolean).join(" · ");
}

const Avatar = ({ name }: { name: string }) => (
  <div
    className="flex size-[40px] shrink-0 items-center justify-center rounded-full font-['Inter'] text-[13.5px] font-semibold text-white"
    style={{ backgroundColor: avatarColor(name) }}
  >
    {initials(name)}
  </div>
);

const StatusPill = ({ status }: { status: CandidateStatus }) => {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-full px-[11px] py-[5px] font-['Inter'] text-[12.5px] font-semibold ${style.pill}`}
    >
      <span className={`size-[6px] rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

const SkillChips = ({ skills }: { skills: string[] }) => {
  if (skills.length === 0) {
    return <span className="font-['Inter'] text-[13px] text-[#B4B1BE]">—</span>;
  }
  const extra = skills.length - MAX_SKILLS;
  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      {skills.slice(0, MAX_SKILLS).map((skill) => (
        <span
          key={skill}
          className="whitespace-nowrap rounded-full border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] px-[10px] py-[3px] font-['Inter'] text-[12.5px] text-[#4B4757]"
        >
          {skill}
        </span>
      ))}
      {extra > 0 && <span className="font-['Inter'] text-[12px] text-[#8B8798]">+{extra}</span>}
    </div>
  );
};

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

const FilterSelect = ({ value, onChange, placeholder, options }: FilterSelectProps) => (
  <div className="relative w-full sm:w-auto">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full cursor-pointer appearance-none rounded-full border-[1.07px] border-[#ECEBF0] bg-white py-[9px] pl-[16px] pr-[38px] font-['Inter'] text-[13.5px] font-semibold text-[#161320] outline-none hover:border-[#D8D3F0] focus:border-[#6D4AFF]"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-[14px] top-1/2 size-[15px] -translate-y-1/2 text-[#4B4757]" />
  </div>
);

const Candidates = () => {
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchCandidates()
      .then(setCandidates)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load candidates"))
      .finally(() => setLoading(false));
  }, []);

  const visibleCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (experience && c.experienceLevel !== experience) return false;
      if (availability && c.availability !== availability) return false;
      if (status && c.status !== status) return false;
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.headline.toLowerCase().includes(query) ||
        c.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [candidates, search, experience, availability, status]);

  return (
    <div>
      <div className="mb-[24px]">
        <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
          MANAGE
        </div>
        <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[26px] text-[#161320] sm:text-[32px]">
          Candidates
        </h1>
        <p className="font-['Inter'] text-[13.5px] text-[#4B4757]">
          Every registered candidate, filterable by skills, experience and availability.
        </p>
      </div>

      <div className="mb-[20px] flex flex-col gap-[10px]">
        <div className="flex w-full items-center gap-[10px] rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[10px] sm:max-w-[360px]">
          <svg
            className="size-[16px] shrink-0 text-[#8B8798]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M18 18l-4.5-4.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, headline or skill…"
            className="w-full min-w-0 bg-transparent font-['Inter'] text-[13.5px] text-[#161320] outline-none placeholder:text-[#8B8798]"
          />
        </div>

        <div className="grid grid-cols-1 gap-[8px] sm:flex sm:flex-wrap">
          <FilterSelect
            value={experience}
            onChange={setExperience}
            placeholder="Any experience"
            options={EXPERIENCE_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
          <FilterSelect
            value={availability}
            onChange={setAvailability}
            placeholder="Any availability"
            options={AVAILABILITY_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            placeholder="Any status"
            options={(Object.keys(STATUS_STYLES) as CandidateStatus[]).map((s) => ({
              value: s,
              label: STATUS_STYLES[s].label,
            }))}
          />
        </div>
      </div>

      {loading ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          Loading candidates…
        </p>
      ) : error ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">{error}</p>
      ) : visibleCandidates.length === 0 ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          {candidates.length === 0 ? "No candidates have registered yet." : "No candidates match those filters."}
        </p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white xl:block">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[14%]" />
                <col className="w-[110px]" />
                <col />
                <col className="w-[130px]" />
                <col className="w-[170px]" />
              </colgroup>
              <thead>
                <tr className="text-left font-['Inter'] text-[11.5px] font-semibold tracking-[0.08em] text-[#8B8798]">
                  <th className="px-[20px] py-[14px] font-semibold">CANDIDATE</th>
                  <th className="px-[12px] py-[14px] font-semibold">LOCATION</th>
                  <th className="px-[12px] py-[14px] font-semibold">EXPERIENCE</th>
                  <th className="px-[12px] py-[14px] font-semibold">SKILLS</th>
                  <th className="px-[12px] py-[14px] font-semibold">APPLICATIONS</th>
                  <th className="px-[20px] py-[14px] font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {visibleCandidates.map((c) => (
                  <tr key={c.id} className="border-t-[1.07px] border-t-[#ECEBF0] font-['Inter'] text-[14px] text-[#161320]">
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[12px]">
                        <Avatar name={c.name} />
                        <div className="min-w-0">
                          <div className="truncate text-[14.5px] font-semibold">{c.name}</div>
                          <div className="truncate text-[12.5px] text-[#8B8798]">{subtitle(c) || c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="truncate px-[12px] py-[16px]">{c.location || "—"}</td>
                    <td className="px-[12px] py-[16px]">{c.experienceLevel || "—"}</td>
                    <td className="px-[12px] py-[16px]">
                      <SkillChips skills={c.skills} />
                    </td>
                    <td className="px-[12px] py-[16px] font-semibold">{c.applications}</td>
                    <td className="px-[20px] py-[16px]">
                      <StatusPill status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2 xl:hidden">
            {visibleCandidates.map((c) => (
              <div key={c.id} className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[16px]">
                <div className="mb-[12px] flex flex-wrap items-start justify-between gap-[10px]">
                  <div className="flex min-w-0 flex-1 items-center gap-[12px]">
                    <Avatar name={c.name} />
                    <div className="min-w-0">
                      <div className="truncate font-['Inter'] text-[14.5px] font-semibold text-[#161320]">{c.name}</div>
                      <div className="truncate font-['Inter'] text-[12.5px] text-[#8B8798]">{subtitle(c) || c.email}</div>
                    </div>
                  </div>
                  <StatusPill status={c.status} />
                </div>

                <div className="mb-[12px] grid grid-cols-2 gap-x-[8px] gap-y-[10px] font-['Inter'] min-[400px]:grid-cols-3">
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">LOCATION</div>
                    <div className="truncate text-[13px] text-[#161320]">{c.location || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">EXPERIENCE</div>
                    <div className="text-[13px] text-[#161320]">{c.experienceLevel || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">APPLICATIONS</div>
                    <div className="text-[13px] font-semibold text-[#161320]">{c.applications}</div>
                  </div>
                </div>

                <SkillChips skills={c.skills} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Candidates;
