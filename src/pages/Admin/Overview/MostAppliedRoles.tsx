import type { MostAppliedRole } from "../../../types/dashboard";

interface MostAppliedRolesProps {
  roles: MostAppliedRole[];
}

const MostAppliedRoles = ({ roles }: MostAppliedRolesProps) => {
  const max = Math.max(1, ...roles.map((role) => role.count));

  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
      <h2 className="mb-[18px] font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
        Most applied-to roles
      </h2>

      {roles.length === 0 ? (
        <p className="py-[16px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          Not enough applications yet.
        </p>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {roles.map((role) => {
            const width = (role.count / max) * 100;
            return (
              <div key={role.id}>
                <div className="mb-[6px] flex items-baseline justify-between gap-[8px] font-['Inter'] text-[13px]">
                  <span className="min-w-0 truncate text-[#161320]">
                    {role.title} <span className="text-[#8B8798]">· {role.companyName}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-[#161320]">{role.count}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded-full bg-[#FAFAFB]">
                  <div
                    className="h-full rounded-full bg-[#6D4AFF] transition-[width]"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MostAppliedRoles;
