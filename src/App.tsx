import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import Applications from "./pages/Applications";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminOverview from "./pages/Admin/Overview";
import Jobs from "./pages/Admin/Jobs";
import JobEditor from "./pages/Admin/JobEditor";
import Clients from "./pages/Admin/Clients";
import ClientDetail from "./pages/Admin/ClientDetail";
import Pipeline from "./pages/Admin/Pipeline";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/job-details/:jobId" element={<JobDetails />} />
        {/* No ProtectedRoute here — a guest can apply without an account.
            The gate is the ApplyGateModal shown from JobDetails, not the
            route itself. */}
        <Route path="/apply/:jobId" element={<Apply />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        {/* The dashboard lives at /admin. This is just a friendly alias so
            /dashboard doesn't land on a blank page. */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* The admin dashboard. allowedRoles means a logged-in CANDIDATE
            gets bounced home — being signed in isn't enough here. The real
            guard is authorize() on the server; this just matches it. */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "recruiter"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/new" element={<JobEditor />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          {/* Both routes render the same Pipeline component — the review
              screen is a slide-over inside it, not a separate page, so the
              list underneath must never unmount when :id shows up. */}
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="pipeline/:id" element={<Pipeline />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
