import { NavLink } from "./NavLink";
import { BlogMenu } from "./BlogMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: any;
  showIf: boolean;
}

interface DesktopMenuProps {
  navItems: NavItem[];
  categories: { id: string; name: string; }[];
  isVisible: boolean;
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const DesktopMenu = ({ 
  navItems, 
  categories, 
  isVisible, 
  isAuthenticated, 
  handleLogout 
}: DesktopMenuProps) => {
  return (
    <div className="hidden sm:flex sm:items-center sm:space-x-8">
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path}>
          <span className="flex items-center gap-1">
            <item.icon className="h-4 w-4" />
            {item.label}
          </span>
        </NavLink>
      ))}
      
      <BlogMenu categories={categories} isVisible={isVisible} />
      <LanguageSwitcher />
      
      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      ) : (
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span className="sr-only">Login</span>
          </Button>
        </Link>
      )}
    </div>
  );
};