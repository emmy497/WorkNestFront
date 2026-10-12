import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiEdit2, FiLogOut, FiUser } from "react-icons/fi";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const navLinks = [{ label: "Find Jobs", to: "/find-jobs" }];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-[#6D4AFF]" : "text-[#4B4568] hover:text-[#161320]";

const accountItemClass =
  "flex w-full items-center gap-[10px] rounded-[10px] px-[12px] py-[10px] text-left text-[14px] font-medium text-[#1A1333] hover:bg-[#F4F1FF] hover:text-[#6D4AFF]";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Avatar = ({ name, size }: { name: string; size: number }) => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-semibold text-[#6D4AFF]"
    style={{ width: size, height: size, fontSize: size * 0.38 }}
  >
    {initials(name)}
  </span>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountOpen) return;

    function handleClick(e: MouseEvent) {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAccountOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

  function handleLogout() {
    setAccountOpen(false);
    logout();
    navigate("/");
  }

  function goTo(path: string) {
    setAccountOpen(false);
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <div className="relative z-10">
      <div className="flex items-center justify-between rounded-full bg-white px-4 py-[9px] mt-[27px] shadow-[0px_4px_24px_0px_rgba(109,74,255,0.0784)] sm:px-6 lg:px-[21px]">
        <Logo width={117} />

        <div className="hidden gap-[32px] text-[14px] font-medium lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <>
              <NavLink to="/applications" className={linkClass}>
                Applications
              </NavLink>
              <NavLink to="/profile" end className={linkClass}>
                My Profile
              </NavLink>
            </>
          )}
        </div>

        <div className="hidden items-center gap-[32px] text-[14px] font-medium lg:flex">
          {isLoggedIn && user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="flex h-[42px] items-center gap-[8px] rounded-[999px] border-[1.5px] border-[#ECEBF0] py-[4px] pl-[4px] pr-[12px] text-[#1A1333] transition-colors hover:border-[#6D4AFF]"
              >
                <Avatar name={user.name} size={32} />
                <span>{user.name.split(" ")[0]}</span>
                <FiChevronDown
                  className={`size-[16px] text-[#8B8798] transition-transform ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                  role="menu"
                  aria-hidden={!accountOpen}
                  className={`absolute right-0 top-[calc(100%+8px)] w-[240px] origin-top-right rounded-[16px] bg-white p-[8px] shadow-[0px_12px_32px_0px_rgba(22,19,32,0.12)] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
                    accountOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none invisible -translate-y-[6px] scale-95 opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-[10px] px-[12px] py-[10px]">
                    <Avatar name={user.name} size={36} />
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-[#161320]">{user.name}</div>
                      <div className="truncate text-[12px] font-normal text-[#8B8798]">{user.email}</div>
                    </div>
                  </div>
                  <hr className="my-[4px] border-[#ECEBF0]" />
                  <button type="button" role="menuitem" tabIndex={accountOpen ? 0 : -1} onClick={() => goTo("/profile")} className={accountItemClass}>
                    <FiUser className="size-[16px]" />
                    View profile
                  </button>
                  <button type="button" role="menuitem" tabIndex={accountOpen ? 0 : -1} onClick={() => goTo("/profile/edit")} className={accountItemClass}>
                    <FiEdit2 className="size-[16px]" />
                    Edit profile
                  </button>
                  <hr className="my-[4px] border-[#ECEBF0]" />
                  <button type="button" role="menuitem" tabIndex={accountOpen ? 0 : -1} onClick={handleLogout} className={accountItemClass}>
                    <FiLogOut className="size-[16px]" />
                    Log out
                  </button>
                </div>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-[#6D4AFF]" : "text-[#1A1333]"
                }
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="flex h-[42px] w-[156px] items-center justify-center rounded-[999px] bg-[#6D4AFF] px-[24px] py-[12px] text-center text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.2)]"
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="relative h-10 w-10 shrink-0 text-[#1A1333] lg:hidden"
        >
          <span className="sr-only">Menu</span>

          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-out ${
              menuOpen ? "rotate-45" : "-translate-y-[6px]"
            }`}
          />

          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-opacity duration-200 ease-out ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-out ${
              menuOpen ? "-rotate-45" : "translate-y-[6px]"
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="animate-slide-down mt-2 flex flex-col gap-4 rounded-2xl bg-white p-5 text-sm font-medium shadow-[0px_4px_24px_0px_rgba(109,74,255,0.0784)] lg:hidden">
          {isLoggedIn && user && (
            <>
              <div className="flex items-center gap-[12px] rounded-[14px] bg-[#F7F5FF] p-[12px]">
                <Avatar name={user.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold text-[#161320]">{user.name}</div>
                  <div className="truncate text-[12px] font-normal text-[#8B8798]">{user.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => goTo("/profile")}
                  className="shrink-0 rounded-[999px] bg-[#6D4AFF] px-[14px] py-[8px] text-[13px] font-semibold text-white"
                >
                  View profile
                </button>
              </div>

              <hr className="border-gray-100" />
            </>
          )}

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <>
              <NavLink
                to="/applications"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Applications
              </NavLink>
              <NavLink
                to="/profile"
                end
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </NavLink>
              <NavLink
                to="/profile/edit"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Edit Profile
              </NavLink>
            </>
          )}

          <hr className="border-gray-100" />

          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center rounded-[999px] border-[1.5px] border-[#6D4AFF] px-[24px] py-[12px] text-center text-[#6D4AFF]"
            >
              Log Out
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-[#6D4AFF]" : "text-[#1A1333]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-[999px] bg-[#6D4AFF] px-[24px] py-[12px] text-center text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.2)]"
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
