import { FiCheck } from "react-icons/fi";
import {
  getProfileSections,
  getProfileCompletionPercent,
} from "../utils/profileCompletion";
import type { Profile } from "../api/profile";

type ProfileProgressCardProps = {
  profile: Profile;
};

const ProfileProgressCard = ({ profile }: ProfileProgressCardProps) => {
  const sections = getProfileSections(profile);
  const percent = getProfileCompletionPercent(profile);

  // An SVG ring drawn with stroke-dasharray, so the "filled" portion is
  // just `percent` of the circle's circumference.
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-6">
      <div className="flex flex-col items-center">
        <div className="relative h-[120px] w-[120px]">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#F2EEFF"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#6D4AFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-['Bricolage_Grotesque'] font-extrabold text-[22px] text-[#161320]">
              {percent}%
            </span>
            <span className="text-[9px] font-medium tracking-[1px] text-[#8B8798]">
              COMPLETE
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-[13px] leading-[19px] text-[#4B4757]">
          {percent === 100
            ? "Your profile is complete and ready to apply."
            : "Your profile is just getting started. Finish it to start applying."}
        </p>
      </div>

      <ul className="mt-5 flex flex-col gap-1 border-t border-[#ECEBF0] pt-4">
        {sections.map((section) => (
          <li
            key={section.key}
            className="flex items-center gap-2.5 py-1.5 text-[13.5px]"
          >
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                section.complete
                  ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
                  : "border-[#D8D5E0] text-transparent"
              }`}
            >
              <FiCheck size={11} strokeWidth={3} />
            </span>
            <span className={section.complete ? "text-[#161320]" : "text-[#8B8798]"}>
              {section.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileProgressCard;
