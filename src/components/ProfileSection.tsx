import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type ProfileSectionProps = {
  icon: IconType;
  title: string;
  children: ReactNode;
};

// The repeated "card with an icon badge and a title" wrapper used by every
// section of the edit-profile page — The basics, Experience, Skills, etc.
const ProfileSection = ({ icon: Icon, title, children }: ProfileSectionProps) => {
  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F2EEFF] text-[#6D4AFF]">
          <Icon size={17} />
        </span>
        <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default ProfileSection;
