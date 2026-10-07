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

type SavedJobsContextType = {
  savedIds: Set<string>;
  savedCount: number;
  loading: boolean;
  isSaved: (jobId: string) => boolean;

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
