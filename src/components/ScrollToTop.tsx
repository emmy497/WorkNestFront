import { useEffect } from "react";
import { useLocation } from "react-router";

// React Router doesn't reset scroll position on navigation by default —
// without this, clicking a link to a new page keeps you scrolled wherever
// you were on the previous page. Render this once, inside the Router,
// alongside <Routes> (it renders nothing itself).
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
