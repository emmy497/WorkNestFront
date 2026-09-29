import { useNavigate } from "react-router-dom";
import { FiX, FiStar } from "react-icons/fi";

type ApplyGateModalProps = {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
};

// Shown instead of navigating straight to /apply/:jobId when nobody is
// logged in. "Continue as a guest" still goes there directly — the route
// and the backend both accept an application with no account behind it.
const ApplyGateModal = ({ jobId, jobTitle, onClose }: ApplyGateModalProps) => {
  const navigate = useNavigate();

  // Carried through signup/login as location.state.from, so the candidate
  // lands back on THIS job's application instead of a generic page once
  // they're done — see Login.tsx / SignUp.tsx / VerifyEmail.tsx.
  const from = `/apply/${jobId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[400px] rounded-[24px] bg-white p-6 text-center shadow-[0px_24px_48px_0px_rgba(22,19,32,0.18)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[18px] top-[18px] flex size-[28px] items-center justify-center rounded-full border-[1.07px] border-[#ECEBF0] text-[#8B8798] transition hover:text-[#161320]"
        >
          <FiX size={14} />
        </button>

        <div className="mx-auto flex size-[52px] items-center justify-center rounded-[16px] bg-[#F1EDFF] text-[#6D4AFF]">
          <FiStar size={22} />
        </div>

        <h2 className="mt-[18px] font-['Bricolage_Grotesque'] font-bold text-[19px] leading-[26px] text-[#161320]">
          Applying to <span className="text-[#6D4AFF]">{jobTitle}</span>?
        </h2>

        <p className="mt-[10px] font-['Inter'] text-[13.5px] leading-[21px] text-[#4B4757]">
          Create a free account and we'll fill in your details for you, here
          and on every future application. Prefer to keep it quick? Apply
          just this once as a guest.
        </p>

        <button
          type="button"
          onClick={() => navigate("/signup", { state: { from } })}
          className="mt-[22px] flex h-[46px] w-full items-center justify-center rounded-full bg-[#6D4AFF] font-['Inter'] font-semibold text-[14px] text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)]"
        >
          Create a free account
        </button>

        <button
          type="button"
          onClick={() => navigate(from)}
          className="mt-[10px] flex h-[46px] w-full items-center justify-center rounded-full border-[1.07px] border-[#ECEBF0] font-['Inter'] font-semibold text-[14px] text-[#161320]"
        >
          Continue as a guest
        </button>

        <div className="mt-[16px] font-['Inter'] text-[13px] text-[#8B8798]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login", { state: { from } })}
            className="font-semibold text-[#6D4AFF] hover:underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyGateModal;
