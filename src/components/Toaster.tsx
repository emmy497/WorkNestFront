import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

// ---------------------------------------------------------------------------
// Wraps react-toastify's ToastContainer so we can change where toasts appear
// depending on the screen size:
//
//   phones   -> top-center (there isn't room to tuck it in a corner)
//   desktop  -> top-right
//
// react-toastify has no built-in way to do this, so we watch the screen
// width ourselves and pass a different `position`.
// ---------------------------------------------------------------------------

// Tailwind's "sm" breakpoint is 640px, so anything under that is a phone.
const MOBILE_QUERY = "(max-width: 639px)";

const Toaster = () => {
  // Work out the starting value straight away, so the very first toast is
  // already in the right place instead of jumping after the first render.
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    // Fires whenever the screen crosses the 640px line — including when
    // someone rotates their phone.
    function handleChange(event: MediaQueryListEvent) {
      setIsMobile(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup: stop listening when this component goes away, otherwise we
    // leave a listener behind every time.
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
      // On phones react-toastify stretches the container edge to edge, so we
      // add our own side padding to keep the card off the screen edges.
      className="!p-4 sm:!p-0"
      // The WorkNest card look. The "!" prefix makes each class !important,
      // which is needed to beat react-toastify's own CSS — including the
      // mobile rules that would otherwise square off the corners.
      toastClassName="relative overflow-hidden !bg-white !rounded-[14px] !border-[1.05px] !border-solid !border-[#ECEBF0] !shadow-[0px_8px_28px_0px_rgba(22,19,32,0.10)] !p-[14px] !pl-[18px] !min-h-0 !mb-[10px]"
    />
  );
};

export default Toaster;
