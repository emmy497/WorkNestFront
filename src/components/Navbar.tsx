import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Find Jobs", to: "/find-jobs" },
  { label: "For Companies", to: "/for-companies" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-[#6D4AFF]" : "text-[#4B4568] hover:text-[#161320]";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Any component inside <AuthProvider> can read this — no props needed.
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="relative z-10">
      <div className="flex items-center justify-between rounded-full bg-white px-4 py-[9px] mt-[27px] shadow-[0px_4px_24px_0px_rgba(109,74,255,0.0784)] sm:px-6 lg:px-[21px]">
        <Logo width={117} />

        {/* Desktop nav links — hidden below lg */}
        <div className="hidden gap-[32px] text-[14px] font-medium lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {/* Only makes sense once you're logged in — the page itself is
              behind ProtectedRoute, so showing it to a signed-out visitor
              would just bounce them to /login. */}
          {isLoggedIn && (
            <NavLink to="/applications" className={linkClass}>
              Applications
            </NavLink>
          )}
        </div>

        {/* Desktop auth buttons — hidden below lg.
            What shows here depends on whether someone is logged in. */}
        <div className="hidden items-center gap-[32px] text-[14px] font-medium lg:flex">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "text-[#6D4AFF]" : "text-[#1A1333] hover:text-[#6D4AFF]"
                }
              >
                Hi, {user?.name.split(" ")[0]}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-[42px] items-center justify-center rounded-[999px] border-[1.5px] border-[#6D4AFF] px-[24px] py-[12px] text-center text-[#6D4AFF]"
              >
                Log Out
              </button>
            </>
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

        {/* Hamburger — visible only below lg */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="relative h-10 w-10 shrink-0 text-[#1A1333] lg:hidden"
        >
          {/* Three bars that morph into an X, instead of swapping one icon
              for another. Each bar is its own div so it can rotate and slide.
              They're centred with left/top + -translate, so every rotation
              spins around the middle of the button. */}
          <span className="sr-only">Menu</span>

          {/* Top bar: slides down to the middle, then rotates 45deg */}
          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-out ${
              menuOpen ? "rotate-45" : "-translate-y-[6px]"
            }`}
          />

          {/* Middle bar: just fades away, so the X is two lines not three */}
          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-opacity duration-200 ease-out ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Bottom bar: slides up to the middle, then rotates the other way */}
          <span
            className={`absolute left-1/2 top-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-out ${
              menuOpen ? "-rotate-45" : "translate-y-[6px]"
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="animate-slide-down mt-2 flex flex-col gap-4 rounded-2xl bg-white p-5 text-sm font-medium shadow-[0px_4px_24px_0px_rgba(109,74,255,0.0784)] lg:hidden">
          {/* Who you are, first — so opening the menu confirms you're
              signed in before you look at anything else. */}
          {isLoggedIn && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "text-[#6D4AFF]" : "text-[#1A1333]"
                }
                onClick={() => setMenuOpen(false)}
              >
                Hi, {user?.name.split(" ")[0]}
              </NavLink>

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
            <NavLink
              to="/applications"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Applications
            </NavLink>
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
