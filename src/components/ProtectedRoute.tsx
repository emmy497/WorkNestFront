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
  const { isLoggedIn, user, loading, sessionCheckFailed, retrySessionCheck } = useAuth();

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
    // sessionCheckFailed means we never actually got a straight answer from
    // the server (dropped connection, a cold-starting backend) — the saved
    // token is still sitting in localStorage. Sending that person to /login
    // would be misleading, since nothing said their credentials were wrong;
    // offer to try again instead of quietly discarding a session that may
    // well still be good.
    if (sessionCheckFailed) {
      return (
        <div className="flex flex-col items-center gap-[12px] py-24 text-center font-['Inter'] text-[14px] text-[#4B4757]">
          <p>Couldn't verify your session. Check your connection and try again.</p>
          <button
            type="button"
            onClick={retrySessionCheck}
            className="rounded-full bg-[#6D4AFF] px-[18px] py-[9px] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0]"
          >
            Try again
          </button>
        </div>
      );
    }

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
