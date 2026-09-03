import React from "react";
import { NavLink } from "react-router-dom";
import LogoLight from "./LogoLight";

// Each link now carries the route it should go to, not just a label.
// A few of these pages don't exist yet — those are left as "" until they do.
const columns = [
  {
    title: "For candidates",
    links: [
      { label: "Find jobs", to: "/find-jobs" },
      { label: "How it works", to: "/how-it-works" },
      { label: "Create profile", to: "/signup" },
      { label: "Your applications", to: "/applications" },
    ],
  },
  {
    title: "For companies",
    links: [
      { label: "Hire through WorkNest", to: "" },
      { label: "How hiring works", to: "" },
      { label: "Talk to us", to: "" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "" },
      { label: "Careers", to: "" },
      { label: "Contact", to: "" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-[120px] bg-[#140A28] px-4 sm:px-8 md:px-16 lg:px-[100px] pt-[40px] pb-[18px] lg:pt-[44px] lg:pb-[40px]">
      <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-8">
        {/* Brand */}
        <div className="mb-4 sm:mb-0">
         <LogoLight/>

          <p className="mt-[22px] max-w-[288px] font-['Inter'] font-normal text-[13px] leading-[18px] lg:mt-[17px] lg:max-w-[222px] lg:leading-[20.5px] text-[hsla(0,0%,100%,0.52)]">
            The hiring hub where a real person reviews your application and gets
            you in front of the companies actually hiring.
          </p>
        </div>

        {/* Link columns */}
        {columns.map((column) => (
          <div key={column.title}>
            <div className="font-['Inter'] font-medium text-[10.5px] leading-[16px] tracking-[1.4px] uppercase text-[hsla(0,0%,100%,0.44)]">
              {column.title}
            </div>

            <ul className="mt-[7px] flex flex-col gap-[4.5px] lg:mt-[14px] lg:gap-[7px]">
              {column.links.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="block font-['Inter'] font-normal text-[13.5px] leading-[18px] lg:leading-[20.5px] text-[hsla(0,0%,100%,0.78)] transition hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-4 lg:mt-[46px] border-t border-[hsla(0,0%,100%,0.09)] pt-[28px]">
        <div className="flex flex-col items-start gap-[7px] sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="font-['Inter'] font-normal text-[10.5px] leading-[16px] tracking-[1.2px] uppercase text-[hsla(0,0%,100%,0.4)]">
            © 2026 WorkNest
          </div>

          <div className="flex items-center gap-[7px] font-['Inter'] font-normal text-[10.5px] leading-[16px] tracking-[1.2px] uppercase text-[hsla(0,0%,100%,0.4)]">
            <NavLink to="" className="transition hover:text-white">
              Privacy
            </NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="" className="transition hover:text-white">
              Terms
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
