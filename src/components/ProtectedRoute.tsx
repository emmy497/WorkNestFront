import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;

  // Optional. If given, the user must also have one of these roles.
  // Leave it out to just require "logged in".
  allowedRoles?: Array<"candidate" | "recruiter" | "admin">;
};

// ---------------------------------------------------------------------------
// Wraps a page that should only be visible to logged-in users.
//
//   <Route path="/dashboard" element={
//     <ProtectedRoute><Dashboard /></ProtectedRoute>
//   } />
//
// IMPORTANT: this only hides the page. It is NOT security. Anyone can edit
// JavaScript in their browser. The real protection is the `protect` and
// `authorize` middleware on the server, which this simply mirrors so the
// user gets a sensible experience.
// ---------------------------------------------------------------------------
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, loading } = useAuth();

  // On first load we are still checking the saved token. Without this,
  // we would redirect to /login for a split second before realising the
  // user was logged in all along.
  if (loading) {
    return (
      <div className="py-24 text-center font-['Inter'] text-[14px] text-[#4B4757]">
        Loading...
      </div>
    );
  }

  // AUTHENTICATION: are you logged in at all?
  if (!isLoggedIn) {
    // `replace` swaps the current history entry instead of adding one,
    // so the back button doesn't bounce them straight back here.
    return <Navigate to="/login" replace />;
  }

  // AUTHORIZATION: are you the right KIND of user?
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Passed both checks — show the page.
  return <>{children}</>;
};

export default ProtectedRoute;
