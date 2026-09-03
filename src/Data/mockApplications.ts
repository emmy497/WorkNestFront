import type { Application } from "../types/application";
import type { Job } from "../types/job";

// A minimal stand-in Job for each application card. Only the fields the
// ApplicationCard / job-details link actually need are filled in with real
// values — the rest just satisfy the Job type.
function stubJob(overrides: Pick<Job, "id" | "companyName" | "title">): Job {
  return {
    companyLogo: "/images/moniepoint_group_icon.svg",
    description: "",
    location: "Remote",
    workArrangement: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid-level",
    careerPath: "Engineering",
    salaryMin: 0,
    salaryMax: 0,
    closesInDays: 0,
    postedDaysAgo: 0,
    whyThisCouldFit: "",
    responsibilities: [],
    requirements: [],
    skills: [],
    ...overrides,
  };
}

// TODO: replace with a real API call (e.g. GET /api/applications) once the
// backend has an endpoint for it. Keep the `Application` shape in
// ../types/application.ts in sync with whatever the API actually returns.
export const mockApplications: Application[] = [
  {
    id: "app-1",
    job: stubJob({ id: "1", companyName: "Moniepoint", title: "Product Designer" }),
    status: "shortlisted",
    appliedAt: "2026-08-25",
    statusMessage: "The Moniepoint team is reviewing your shortlist.",
  },
  {
    id: "app-2",
    job: stubJob({ id: "2", companyName: "Paystack", title: "Frontend Engineer" }),
    status: "interview",
    appliedAt: "2026-08-22",
    statusMessage: "Interview scheduled for Thursday, 2:00 PM.",
  },
  {
    id: "app-3",
    job: stubJob({ id: "3", companyName: "Cowrywise", title: "Data Analyst" }),
    status: "review",
    appliedAt: "2026-08-20",
    statusMessage: "Our team is reviewing your application.",
  },
  {
    id: "app-4",
    job: stubJob({ id: "4", companyName: "Kuda", title: "Customer Success Lead" }),
    status: "submitted",
    appliedAt: "2026-08-26",
    statusMessage: "Received — you're in the queue for review.",
  },
  {
    id: "app-5",
    job: stubJob({ id: "5", companyName: "Flutterwave", title: "Backend Engineer" }),
    status: "rejected",
    appliedAt: "2026-08-10",
    statusMessage: "Not moving forward this time — feedback added.",
  },
];
