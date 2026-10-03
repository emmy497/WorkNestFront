import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { FiX, FiExternalLink } from "react-icons/fi";
import type { AdminApplicationDetail, Scorecard } from "../../../types/application";
import { APPLICATION_STATUS_CONFIG, STAGE_LABELS } from "../../../types/application";
import {
  fetchAdminApplication,
  updateApplicationScorecard,
  updateApplicationStatus,
} from "../../../api/adminApplications";
import StarRating from "../../../components/StarRating";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const EMPTY_SCORECARD: Scorecard = {
  skillsMatch: 0,
  experience: 0,
  communication: 0,
  portfolioWork: 0,
};

// Average of the 4 ratings, one decimal place. 0 while nothing's rated yet.
// Guards against a missing/partial scorecard (e.g. an application saved
// before this field existed) rather than trusting the type at runtime.
function overallScore(scorecard: Scorecard | undefined | null): number {
  const values = Object.values(scorecard ?? EMPTY_SCORECARD);
  const sum = values.reduce((total, v) => total + (v ?? 0), 0);
  return Math.round((sum / values.length) * 10) / 10;
}

const SCORECARD_ROWS: { key: keyof Scorecard; label: string }[] = [
  { key: "skillsMatch", label: "Skills match" },
  { key: "experience", label: "Experience" },
  { key: "communication", label: "Communication" },
  { key: "portfolioWork", label: "Portfolio / work" },
];

interface ApplicationReviewProps {
  id: string;
  // Called when the panel should close — the parent (Pipeline) owns whether
  // that means clearing a URL param, local state, or both.
  onClose: () => void;
}

// The content of the review slide-over. Deliberately has no idea it's inside
// a drawer — it just renders a scrollable column of sections and takes
// `id`/`onClose` as props, so Pipeline can mount it wherever it likes.
const ApplicationReview = ({ id, onClose }: ApplicationReviewProps) => {
  const [application, setApplication] = useState<AdminApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local, editable copies — only written back on "Save notes & score", so
  // typing in the note box doesn't fire a request on every keystroke.
  const [scorecard, setScorecard] = useState<Scorecard>(EMPTY_SCORECARD);
  const [internalNote, setInternalNote] = useState("");

  const [savingNotes, setSavingNotes] = useState(false);
  const [changingStage, setChangingStage] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAdminApplication(id)
      .then((data) => {
        setApplication(data);
        setScorecard(data.scorecard ?? EMPTY_SCORECARD);
        setInternalNote(data.internalNote ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this application"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      const updated = await updateApplicationScorecard(id, scorecard, internalNote);
      setApplication(updated);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your changes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleStatusChange(status: AdminApplicationDetail["status"]) {
    setChangingStage(true);
    try {
      const updated = await updateApplicationStatus(id, status);
      setApplication(updated);
      toast.success(
        status === "rejected"
          ? "Candidate notified — application rejected"
          : `Candidate notified — moved to ${APPLICATION_STATUS_CONFIG[status].label}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this application");
    } finally {
      setChangingStage(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* drawer header — stays put while the body below scrolls */}
      <div className="flex shrink-0 items-center justify-between border-b-[1.07px] border-b-[#ECEBF0] px-[24px] py-[18px]">
        <span className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#161320]">
          Application review
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-[30px] items-center justify-center rounded-[8px] text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#161320]"
        >
          <FiX className="size-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-[24px]">
        {loading ? (
          <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[48px] text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
            Loading application…
          </div>
        ) : error || !application ? (
          <div className="rounded-[16px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-[48px] text-center">
            <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
              Something went wrong
            </div>
            <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
              {error || "Application not found."}
            </p>
          </div>
        ) : (
          <ApplicationReviewBody
            application={application}
            scorecard={scorecard}
            setScorecard={setScorecard}
            internalNote={internalNote}
            setInternalNote={setInternalNote}
            savingNotes={savingNotes}
            changingStage={changingStage}
            onSaveNotes={handleSaveNotes}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

// Split out so the loading/error branches above don't have to thread these
// eight props through — this only ever renders once `application` is loaded.
interface ApplicationReviewBodyProps {
  application: AdminApplicationDetail;
  scorecard: Scorecard;
  setScorecard: Dispatch<SetStateAction<Scorecard>>;
  internalNote: string;
  setInternalNote: (note: string) => void;
  savingNotes: boolean;
  changingStage: boolean;
  onSaveNotes: () => void;
  onStatusChange: (status: AdminApplicationDetail["status"]) => void;
}

function ApplicationReviewBody({
  application,
  scorecard,
  setScorecard,
  internalNote,
  setInternalNote,
  savingNotes,
  changingStage,
  onSaveNotes,
  onStatusChange,
}: ApplicationReviewBodyProps) {
  const config = APPLICATION_STATUS_CONFIG[application.status];
  const isTerminal = application.status === "rejected" || application.nextStage === null;
  const score = overallScore(scorecard);

  return (
    <div>
      {/* header */}
      <div className="mb-[22px] flex items-start justify-between gap-[12px]">
        <div className="flex items-center gap-[14px]">
          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-['Inter'] text-[17px] font-semibold text-[#6D4AFF]">
            {initials(application.fullName)}
          </div>
          <div>
            <div className="font-['Bricolage_Grotesque'] font-bold text-[19px] text-[#161320]">
              {application.fullName}
            </div>
            <div className="font-['Inter'] text-[13px] text-[#8B8798]">
              {application.candidateHeadline || "Candidate"}
            </div>
          </div>
        </div>

        <span
          className="whitespace-nowrap rounded-full px-[12px] py-[6px] font-['Inter'] text-[12px] font-semibold"
          style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
        >
          {config.label}
        </span>
      </div>

      {/* candidate info */}
      <div className="mb-[22px]">
        <div className="mb-[10px] font-['Inter'] text-[11px] font-semibold tracking-[0.08em] text-[#8B8798]">
          CANDIDATE
        </div>
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[14px]">
          <InfoField label="Location" value={application.location || "—"} />
          <InfoField label="Applying for" value={application.job?.title ?? "—"} />
          <InfoField label="Client" value={application.job?.companyName ?? "—"} />
          <InfoField label="Experience" value={application.yearsOfExperience || "—"} />
          <InfoField label="Availability" value={application.availability || "—"} />
          <InfoField label="Expected salary" value={application.expectedSalary || "—"} />
        </div>

        <div className="mt-[14px] flex flex-wrap gap-[8px]">
          {application.cvUrl && (
            <LinkChip href={application.cvUrl} label={application.cvOriginalName || "CV"} />
          )}
          {application.portfolioLink && (
            <LinkChip href={application.portfolioLink} label="Portfolio" />
          )}
          {application.linkedin && <LinkChip href={application.linkedin} label="LinkedIn" />}
        </div>
      </div>

      {/* screening answers */}
      <div className="mb-[22px] border-t-[1.07px] border-t-[#ECEBF0] pt-[18px]">
        <div className="mb-[8px] font-['Inter'] text-[11px] font-semibold tracking-[0.08em] text-[#8B8798]">
          SCREENING ANSWERS
        </div>
        <div className="mb-[4px] font-['Inter'] text-[12.5px] font-semibold text-[#161320]">
          Why this role?
        </div>
        <p className="font-['Inter'] text-[13.5px] leading-relaxed text-[#4B4757]">
          {application.whyThisRole}
        </p>

        {/* Only present on jobs whose poster added questions of their own —
            see JobEditor.tsx's "Screening questions" section. */}
        {application.screeningAnswers.map((entry, index) => (
          <div key={index} className="mt-[14px]">
            <div className="mb-[4px] font-['Inter'] text-[12.5px] font-semibold text-[#161320]">
              {entry.question}
            </div>
            <p className="font-['Inter'] text-[13.5px] leading-relaxed text-[#4B4757]">
              {entry.answer}
            </p>
          </div>
        ))}
      </div>

      {/* scorecard */}
      <div className="mb-[22px] border-t-[1.07px] border-t-[#ECEBF0] pt-[18px]">
        <div className="mb-[14px] font-['Inter'] text-[11px] font-semibold tracking-[0.08em] text-[#8B8798]">
          SCORECARD — AGAINST THIS ROLE
        </div>

        <div className="flex flex-col gap-[12px]">
          {SCORECARD_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <span className="font-['Inter'] text-[13.5px] text-[#4B4757]">{row.label}</span>
              <StarRating
                value={scorecard[row.key]}
                onChange={(value) => setScorecard((prev) => ({ ...prev, [row.key]: value }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-[16px] flex items-center justify-between rounded-[14px] bg-[#F1EDFF] px-[16px] py-[14px]">
          <span className="font-['Inter'] text-[13.5px] font-semibold text-[#6D4AFF]">
            Overall score
          </span>
          <span className="font-['Bricolage_Grotesque'] font-extrabold text-[20px] text-[#6D4AFF]">
            {score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* internal notes */}
      <div className="mb-[22px] border-t-[1.07px] border-t-[#ECEBF0] pt-[18px]">
        <div className="mb-[8px] font-['Inter'] text-[11px] font-semibold tracking-[0.08em] text-[#8B8798]">
          INTERNAL NOTES — ONLY YOUR TEAM SEES THESE
        </div>
        <textarea
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          rows={3}
          placeholder="e.g. Portfolio a bit thin for the seniority. Not moving forward."
          className="w-full resize-none rounded-[12px] border-[1.07px] border-[#ECEBF0] p-[12px] font-['Inter'] text-[13.5px] text-[#161320] outline-none placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
        />
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center justify-between gap-[12px] border-t-[1.07px] border-t-[#ECEBF0] pt-[18px]">
        <button
          type="button"
          onClick={onSaveNotes}
          disabled={savingNotes}
          className="font-['Inter'] text-[13.5px] font-semibold text-[#6D4AFF] hover:underline disabled:opacity-50"
        >
          {savingNotes ? "Saving…" : "Save notes & score"}
        </button>

        <div className="flex gap-[10px]">
          {application.status !== "rejected" && (
            <button
              type="button"
              onClick={() => onStatusChange("rejected")}
              disabled={changingStage}
              className="rounded-full border-[1.07px] border-[#F5C2C2] bg-white px-[20px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-[#C62828] hover:bg-[#FFF7F7] disabled:opacity-50"
            >
              Reject
            </button>
          )}

          {!isTerminal && application.nextStage && (
            <button
              type="button"
              onClick={() => onStatusChange(application.nextStage!)}
              disabled={changingStage}
              className="rounded-full bg-[#6D4AFF] px-[20px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0] disabled:opacity-50"
            >
              {STAGE_LABELS[application.nextStage]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-['Inter'] text-[11px] text-[#8B8798]">{label}</div>
      <div className="font-['Inter'] text-[13.5px] font-medium text-[#161320]">{value}</div>
    </div>
  );
}

function LinkChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-[6px] rounded-full border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] px-[12px] py-[6px] font-['Inter'] text-[12.5px] font-medium text-[#4B4757] hover:bg-[#F1EDFF] hover:text-[#6D4AFF]"
    >
      <FiExternalLink className="size-[12px]" />
      {label}
    </a>
  );
}

export default ApplicationReview;
