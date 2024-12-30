import { Link } from "react-router-dom";

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const MobileNavLink = ({ to, onClick, children }: MobileNavLinkProps) => (
  <Link
    to={to}
    className="flex items-center text-foreground hover:text-primary hover:bg-primary/10 px-3 py-2 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);