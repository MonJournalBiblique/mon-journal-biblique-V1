import { BookOpen } from "lucide-react";
import { MobileNavLink } from "./MobileNavLink";
import { LogIn, LogOut } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: any;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  categories: { id: string; name: string; }[];
  isVisible: boolean;
  isAuthenticated: boolean;
  handleLogout: () => void;
  toggleMenu: () => void;
}

export const MobileMenu = ({
  isOpen,
  navItems,
  categories,
  isVisible,
  isAuthenticated,
  handleLogout,
  toggleMenu,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {navItems.map((item) => (
          <MobileNavLink
            key={item.path}
            to={item.path}
            onClick={toggleMenu}
          >
            <item.icon className="h-5 w-5 mr-2" />
            {item.label}
          </MobileNavLink>
        ))}
        {isVisible && categories.map(category => (
          <MobileNavLink
            key={category.id}
            to={`/blog/category/${category.id}`}
            onClick={toggleMenu}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {category.name}
          </MobileNavLink>
        ))}
        {isAuthenticated ? (
          <MobileNavLink
            to="#"
            onClick={() => {
              handleLogout();
              toggleMenu();
            }}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </MobileNavLink>
        ) : (
          <MobileNavLink
            to="/login"
            onClick={toggleMenu}
          >
            <LogIn className="h-5 w-5 mr-2" />
            Connexion
          </MobileNavLink>
        )}
      </div>
    </div>
  );
};