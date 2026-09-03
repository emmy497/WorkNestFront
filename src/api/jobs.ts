import type { Job } from "../types/job";

// Where our backend lives. In development that's the Express server on port 5000.
//
// We read it from an environment variable so we can point at a real server
// when we deploy, without changing any code. Vite requires the VITE_ prefix.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ---------------------------------------------------------------------------
// Get every open job.
//
// `fetch` is built into the browser — nothing to install.
// It returns a Promise, so we use async/await to wait for the answer.
// ---------------------------------------------------------------------------
export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`);

  // IMPORTANT: fetch does NOT throw on 404 or 500. It only throws if the
  // request never happened at all (no internet, server down).
  // So we have to check response.ok ourselves.
  if (!response.ok) {
    throw new Error("Could not load jobs");
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Get one job by its id, for the details page.
// ---------------------------------------------------------------------------
export async function fetchJobById(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${id}`);

  if (!response.ok) {
    throw new Error("Could not load that job");
  }

  return response.json();
}
