import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchSavedJobIds,
  saveJobRequest,
  unsaveJobRequest,
} from "../api/savedJobs";
import { useAuth } from "./AuthContext";

// ---------------------------------------------------------------------------
// Why a Context for this?
//
// A bookmark icon appears on every job card, on the details page, and the
// saved list needs a count. If each of those fetched its own data we'd fire
// a dozen requests and they could disagree with each other.
//
// Instead we load the saved ids ONCE and share them. Any component can then
// ask "is this saved?" and toggle it, and every icon updates together.
// ---------------------------------------------------------------------------

type SavedJobsContextType = {
  // A Set, not an array, because we ask "does it contain this id?" constantly
  // and a Set answers that instantly regardless of how many are saved.
  savedIds: Set<string>;
  savedCount: number;
  loading: boolean;
  isSaved: (jobId: string) => boolean;

  // Returns the new state, so the caller can show the right toast.
  toggleSave: (jobId: string) => Promise<boolean>;
};

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
  undefined
);

type SavedJobsProviderProps = {
  children: ReactNode;
};

export const SavedJobsProvider = ({ children }: SavedJobsProviderProps) => {
  const { isLoggedIn } = useAuth();

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Reload whenever the login state changes.
  //
  // Logging out has to clear the list, or the next person to use the browser
  // would see the previous user's bookmarks filled in.
  useEffect(() => {
    if (!isLoggedIn) {
      setSavedIds(new Set());
      return;
    }

    setLoading(true);
    fetchSavedJobIds()
      .then((ids) => setSavedIds(new Set(ids)))
      .catch(() => setSavedIds(new Set()))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const isSaved = (jobId: string) => savedIds.has(jobId);

  async function toggleSave(jobId: string): Promise<boolean> {
    const wasSaved = savedIds.has(jobId);

    // Update the screen FIRST, before waiting for the server.
    //
    // This is called an optimistic update: the bookmark fills in instantly
    // instead of pausing for the round trip. If the request then fails, we
    // put it back the way it was.
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(jobId);
      else next.add(jobId);
      return next;
    });

    try {
      if (wasSaved) await unsaveJobRequest(jobId);
      else await saveJobRequest(jobId);

      return !wasSaved;
    } catch (error) {
      // Undo the optimistic change.
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });

      throw error;
    }
  }

  const value: SavedJobsContextType = {
    savedIds,
    savedCount: savedIds.size,
    loading,
    isSaved,
    toggleSave,
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);

  if (context === undefined) {
    throw new Error("useSavedJobs must be used inside a SavedJobsProvider");
  }

  return context;
}
