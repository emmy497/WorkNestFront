import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { toast } from "../lib/toast";

type SaveJobButtonProps = {
  jobId: string;
  jobTitle: string;

  variant?: "plain" | "circle";
};

const SaveJobButton = ({
  jobId,
  jobTitle,
  variant = "plain",
}: SaveJobButtonProps) => {
  const { isLoggedIn } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);

  const saved = isSaved(jobId);

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Log in to save jobs", "Saved roles are kept to your account.");
      navigate("/login");
      return;
    }

    setBusy(true);

    try {
      const nowSaved = await toggleSave(jobId);

      if (nowSaved) toast.success("Saved", jobTitle);
      else toast.info("Removed from saved", jobTitle);
    } catch {
      toast.error("Could not update your saved jobs", "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const circleClasses =
    "flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${jobTitle} from saved` : `Save ${jobTitle}`}
      className={`shrink-0 transition disabled:opacity-60 ${
        variant === "circle" ? circleClasses : "p-[2px]"
      } ${saved ? "text-[#6D4AFF]" : "text-[#8B8798] hover:text-[#6D4AFF]"}`}
    >
      <FiBookmark
        size={variant === "circle" ? 16 : 18}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
};

export default SaveJobButton;
