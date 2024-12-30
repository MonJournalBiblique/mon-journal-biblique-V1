import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const NavLink = ({ to, children }: NavLinkProps) => (
  <Link
    to={to}
    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
  >
    {children}
  </Link>
);