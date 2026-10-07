import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;

  allowedRoles?: Array<"candidate" | "recruiter" | "admin">;
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, loading, sessionCheckFailed, retrySessionCheck } = useAuth();

  if (loading) {
    return (
      <div className="py-24 text-center font-['Inter'] text-[14px] text-[#4B4757]">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
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

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
