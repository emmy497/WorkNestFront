import { toast as baseToast, type ToastOptions } from "react-toastify";
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from "react-icons/fi";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Our own toast helper.
//
// Instead of calling react-toastify directly all over the app, every screen
// imports from here. That means the WorkNest look is defined ONCE, and if we
// ever want to change how toasts appear we only edit this file.
//
// Usage:
//   import { toast } from "../lib/toast";
//   toast.success("Profile updated");
//   toast.error("Could not save your changes");
// ---------------------------------------------------------------------------

// Every colour below already appears somewhere else on the site — there are
// no new ones. The four kinds are told apart by the ICON first, and by a
// quiet shift in tone second, rather than by a different bright colour each.
//
//   success  purple  #6D4AFF   the brand colour, same as buttons and links
//   error    dark    #140A28   the deep aubergine from the CTA card and footer
//   warning  yellow  #FFC93C   the accent from "Featured" and the CTA badge
//   info     grey    #8B8798   the muted grey used for secondary text
// `accent` styles the stripe down the left edge.
// `progress` styles the countdown bar along the bottom, to match it.
//
// The progress bar needs "!bg-none" as well: react-toastify paints a
// rainbow gradient there by default, and a gradient is a background-IMAGE.
// Setting only a background-colour would sit underneath it and never show.
const styles = {
  success: {
    icon: FiCheck,
    iconBg: "bg-[#F2EEFF]",
    iconColor: "text-[#6D4AFF]",
    accent: "bg-[#6D4AFF]",
    progress: "!bg-none !bg-[#6D4AFF]",
  },
  error: {
    icon: FiX,
    iconBg: "bg-[#F2F1F6]",
    iconColor: "text-[#140A28]",
    accent: "bg-[#140A28]",
    progress: "!bg-none !bg-[#140A28]",
  },
  warning: {
    icon: FiAlertTriangle,
    iconBg: "bg-[#FFFCF2]",
    iconColor: "text-[#8A5A12]",
    accent: "bg-[#FFC93C]",
    progress: "!bg-none !bg-[#FFC93C]",
  },
  info: {
    icon: FiInfo,
    iconBg: "bg-[#F2F1F6]",
    iconColor: "text-[#4B4757]",
    accent: "bg-[#8B8798]",
    progress: "!bg-none !bg-[#8B8798]",
  },
};

type ToastKind = keyof typeof styles;

// The actual thing shown inside the toast box: a coloured stripe down the
// left, a round icon, then the message.
function ToastBody({
  kind,
  title,
  message,
}: {
  kind: ToastKind;
  title: string;
  message?: ReactNode;
}) {
  const style = styles[kind];
  const Icon = style.icon;

  return (
    <div className="flex items-start gap-[12px] pr-1">
      {/* The coloured stripe */}
      <div
        className={`absolute left-0 top-0 h-full w-[4px] rounded-l-[14px] ${style.accent}`}
      />

      <div
        className={`mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
      >
        <Icon size={15} strokeWidth={2.5} />
      </div>

      <div className="min-w-0">
        <div className="font-['Inter'] text-[13.5px] font-semibold leading-[20px] text-[#161320]">
          {title}
        </div>

        {message && (
          <div className="mt-[2px] font-['Inter'] text-[12.5px] leading-[18px] text-[#4B4757]">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Shared settings for every toast we show.
//
// The card styling itself (white background, rounded corners, border,
// shadow) lives on the ToastContainer in main.tsx as `toastClassName`.
// It has to go there because react-toastify ships its own CSS for those
// properties, and container-level classes are where we can override it.
const baseOptions: ToastOptions = {
  // We draw our own icon inside ToastBody, so turn off the built-in one.
  icon: false,
  closeButton: false,
};

function show(kind: ToastKind, title: string, message?: ReactNode) {
  return baseToast(<ToastBody kind={kind} title={title} message={message} />, {
    ...baseOptions,
    // The bottom bar takes the same colour as this kind's left stripe.
    progressClassName: styles[kind].progress,
    // A short accessible label for screen readers.
    ariaLabel: title,
  });
}

export const toast = {
  success: (title: string, message?: ReactNode) => show("success", title, message),
  error: (title: string, message?: ReactNode) => show("error", title, message),
  info: (title: string, message?: ReactNode) => show("info", title, message),
  warning: (title: string, message?: ReactNode) => show("warning", title, message),

  // Handy for a "saving..." toast that later turns into success or error.
  dismiss: baseToast.dismiss,
};
