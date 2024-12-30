import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AdminBadge } from "./AdminBadge";

interface LogoProps {
  isAdmin: boolean;
}

export const Logo = ({ isAdmin }: LogoProps) => {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center">
      <BookOpen className="h-8 w-8 text-primary" />
      <span className="ml-2 font-serif text-xl font-semibold">MJB</span>
      <AdminBadge isAdmin={isAdmin} />
    </Link>
  );
};