import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiHome,
  FiUsers,
  FiFilter,
  FiBell,
  FiSettings,
  FiSearch,
  FiPlus,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";
import { fetchDashboardOverview } from "../../api/dashboard";
import type { DashboardOverview } from "../../types/dashboard";

// Shared with every nested admin page via <Outlet context={...} />, so the
// dashboard data is fetched exactly once here — the sidebar's badge counts
// and the Overview page's widgets both come from the same response.
export interface AdminOutletContext {
  overview: DashboardOverview | null;
  loading: boolean;
  error: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The sidebar is part of the flex row on large screens, but becomes a
  // slide-in drawer below lg — closed by default so it doesn't cover the
  // page on first load.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchDashboardOverview()
      .then((data) => setOverview(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const mainItems: NavItem[] = [{ to: "/admin", label: "Overview", icon: FiGrid }];

  const manageItems: NavItem[] = [
    { to: "/admin/jobs", label: "Jobs", icon: FiBriefcase, count: overview?.counts.jobs },
    { to: "/admin/clients", label: "Clients", icon: FiHome, count: overview?.counts.clients },
    { to: "/admin/candidates", label: "Candidates", icon: FiUsers, count: overview?.counts.candidates },
    { to: "/admin/pipeline", label: "Pipeline", icon: FiFilter },
  ];

  const moreItems: NavItem[] = [
    { to: "/admin/notifications", label: "Notifications", icon: FiBell },
    { to: "/admin/settings", label: "Settings", icon: FiSettings },
  ];

  function renderNavItem(item: NavItem) {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/admin"}
        onClick={() => setMobileNavOpen(false)}
        className={({ isActive }) =>
          `flex items-center justify-between rounded-[10px] px-[12px] py-[9px] font-['Inter'] text-[14px] font-medium transition-colors ${
            isActive
              ? "bg-[#F1EDFF] text-[#6D4AFF]"
              : "text-[#4B4757] hover:bg-[#FAFAFB]"
          }`
        }
      >
        <span className="flex items-center gap-[10px]">
          <Icon className="size-[17px]" />
          {item.label}
        </span>
        {item.count !== undefined && (
          <span className="font-['Inter'] text-[12px] text-[#8B8798]">{item.count}</span>
        )}
      </NavLink>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      {/* Backdrop behind the mobile drawer — tapping it closes the menu,
          same as the X button or a nav link. Hidden entirely at lg, where
          the sidebar is always part of the layout instead of an overlay. */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-[#161320]/30 lg:hidden"
        />
      )}

      {/* ---------------- sidebar ---------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r-[1.07px] border-r-[#ECEBF0] bg-white px-[20px] py-[24px] transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-[32px] flex items-center justify-between gap-[10px] px-[4px]">
          <div className="flex items-center gap-[10px]">
            <Logo width={120} />
            <span className="rounded-[6px] bg-[#F1EDFF] px-[8px] py-[3px] font-['Inter'] text-[10.5px] font-bold tracking-[0.04em] text-[#6D4AFF]">
              ADMIN
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] text-[#8B8798] hover:bg-[#FAFAFB] lg:hidden"
          >
            <FiX className="size-[18px]" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-[22px] overflow-y-auto">
          <div>
            <div className="mb-[8px] px-[12px] font-['Inter'] text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">
              MAIN
            </div>
            <div className="flex flex-col gap-[2px]">{mainItems.map(renderNavItem)}</div>
          </div>

          <div>
            <div className="mb-[8px] px-[12px] font-['Inter'] text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">
              MANAGE
            </div>
            <div className="flex flex-col gap-[2px]">{manageItems.map(renderNavItem)}</div>
          </div>

          <div>
            <div className="mb-[8px] px-[12px] font-['Inter'] text-[10.5px] font-semibold tracking-[0.08em] text-[#8B8798]">
              MORE
            </div>
            <div className="flex flex-col gap-[2px]">{moreItems.map(renderNavItem)}</div>
          </div>
        </nav>

        {user && (
          <div className="flex items-center gap-[10px] border-t-[1.07px] border-t-[#ECEBF0] pt-[16px]">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-['Inter'] text-[13px] font-semibold text-[#6D4AFF]">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                {user.name}
              </div>
              <div className="truncate font-['Inter'] text-[12px] text-[#8B8798] capitalize">
                {user.role}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              className="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#161320]"
            >
              <FiLogOut className="size-[16px]" />
            </button>
          </div>
        )}
      </aside>

      {/* ---------------- main column ---------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-[12px] border-b-[1.07px] border-b-[#ECEBF0] bg-white px-[16px] py-[14px] sm:gap-[16px] sm:px-[24px] lg:px-[32px] lg:py-[16px]">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full border-[1.07px] border-[#ECEBF0] text-[#4B4757] hover:bg-[#FAFAFB] lg:hidden"
          >
            <FiMenu className="size-[17px]" />
          </button>

          {/* Not yet wired to anything — hidden below sm so it doesn't
              crowd out the buttons on a phone-width header. */}
          <div className="hidden flex-1 items-center gap-[10px] rounded-full bg-[#FAFAFB] px-[16px] py-[9px] sm:flex">
            <FiSearch className="size-[16px] shrink-0 text-[#8B8798]" />
            <input
              type="text"
              placeholder="Search jobs, candidates, clients..."
              className="w-full min-w-0 bg-transparent font-['Inter'] text-[13.5px] text-[#161320] outline-none placeholder:text-[#8B8798]"
            />
          </div>
          <div className="flex-1 sm:hidden" />

          <button
            type="button"
            aria-label="Notifications"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full border-[1.07px] border-[#ECEBF0] text-[#4B4757] hover:bg-[#FAFAFB]"
          >
            <FiBell className="size-[16px]" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/jobs/new")}
            className="flex shrink-0 items-center gap-[8px] rounded-[10px] bg-[#6D4AFF] px-[12px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0] sm:px-[16px]"
          >
            <FiPlus className="size-[15px]" />
            <span className="hidden sm:inline">New job</span>
          </button>
        </header>

        <main className="flex-1 px-[16px] py-[20px] sm:px-[24px] sm:py-[24px] lg:px-[32px] lg:py-[28px]">
          <Outlet context={{ overview, loading, error } satisfies AdminOutletContext} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
