import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { toast } from "../lib/toast";

type SaveJobButtonProps = {
  jobId: string;
  jobTitle: string;

  // The card version is a small plain icon; the details page version sits
  // in a white circle. Same behaviour, different clothing.
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
    // The job card is wrapped in a link. Without these two lines, tapping
    // the bookmark would ALSO navigate to the job details page.
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
      // aria-pressed tells a screen reader this is a toggle and whether
      // it's currently on, which a plain icon can't communicate.
      aria-pressed={saved}
      aria-label={saved ? `Remove ${jobTitle} from saved` : `Save ${jobTitle}`}
      className={`shrink-0 transition disabled:opacity-60 ${
        variant === "circle" ? circleClasses : "p-[2px]"
      } ${saved ? "text-[#6D4AFF]" : "text-[#8B8798] hover:text-[#6D4AFF]"}`}
    >
      {/* Same icon either way — when saved we fill it in, which is what
          makes the state obvious at a glance. */}
      <FiBookmark
        size={variant === "circle" ? 16 : 18}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
};

export default SaveJobButton;
