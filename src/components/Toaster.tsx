import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const MOBILE_QUERY = "(max-width: 639px)";

const Toaster = () => {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    function handleChange(event: MediaQueryListEvent) {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"}
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      className="!p-4 sm:!p-0"
      toastClassName="relative overflow-hidden !bg-white !rounded-[14px] !border-[1.05px] !border-solid !border-[#ECEBF0] !shadow-[0px_8px_28px_0px_rgba(22,19,32,0.10)] !p-[14px] !pl-[18px] !min-h-0 !mb-[10px]"
    />
  );
};

export default Toaster;
