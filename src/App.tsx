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
import Candidates from "./pages/Admin/Candidates";
import Pipeline from "./pages/Admin/Pipeline";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Terms from "./pages/Info/Terms";
import Privacy from "./pages/Info/Privacy";
import About from "./pages/Info/About";
import ForCompanies from "./pages/Info/ForCompanies";
import Contact from "./pages/Info/Contact";
import NotFound from "./pages/NotFound";
import AdminNotifications from "./pages/Admin/Notifications";
import AdminSettings from "./pages/Admin/Settings";

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
        <Route path="/apply/:jobId" element={<Apply />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/for-companies" element={<ForCompanies />} />
        <Route path="/contact" element={<Contact />} />
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

        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

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
          <Route path="candidates" element={<Candidates />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="pipeline/:id" element={<Pipeline />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
