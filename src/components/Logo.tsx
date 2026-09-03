import { NavLink } from "react-router-dom";

type LogoProps = {
  width?: number | string;
  className?: string;
};

const Logo = ({ width = 211, className }: LogoProps) => {
  return (
    <NavLink to="/" className={className}>
      <img
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        src="/images/Logo.png"
        alt="WorkNest"
      />
    </NavLink>
  );
};

export default Logo;
