import { toast as baseToast, type ToastOptions } from "react-toastify";
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from "react-icons/fi";
import type { ReactNode } from "react";

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

const baseOptions: ToastOptions = {
  icon: false,
  closeButton: false,
};

function show(kind: ToastKind, title: string, message?: ReactNode) {
  return baseToast(<ToastBody kind={kind} title={title} message={message} />, {
    ...baseOptions,
    progressClassName: styles[kind].progress,
    ariaLabel: title,
  });
}

export const toast = {
  success: (title: string, message?: ReactNode) => show("success", title, message),
  error: (title: string, message?: ReactNode) => show("error", title, message),
  info: (title: string, message?: ReactNode) => show("info", title, message),
  warning: (title: string, message?: ReactNode) => show("warning", title, message),

  dismiss: baseToast.dismiss,
};
