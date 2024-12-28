import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, Home, PenTool, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showBlogMenu, setShowBlogMenu] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-2 font-serif text-xl font-semibold">MJB</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/">Accueil</NavLink>
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setShowBlogMenu(!showBlogMenu)}
              >
                Blog
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className={cn(
                "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200",
                showBlogMenu ? "opacity-100 visible" : "opacity-0 invisible"
              )}>
                <div className="py-1">
                  <Link
                    to="/blog"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowBlogMenu(false)}
                  >
                    All Posts
                  </Link>
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/blog/category/${category.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBlogMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "sm:hidden",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavLink to="/" onClick={toggleMenu}>
            <Home className="h-5 w-5 mr-2" />
            Accueil
          </MobileNavLink>
          <MobileNavLink to="/blog" onClick={toggleMenu}>
            <BookOpen className="h-5 w-5 mr-2" />
            All Posts
          </MobileNavLink>
          {categories.map(category => (
            <MobileNavLink
              key={category.id}
              to={`/blog/category/${category.id}`}
              onClick={toggleMenu}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              {category.name}
            </MobileNavLink>
          ))}
          <MobileNavLink to="/dashboard" onClick={toggleMenu}>
            <PenTool className="h-5 w-5 mr-2" />
            Dashboard
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="flex items-center text-gray-700 hover:text-primary hover:bg-secondary/50 px-3 py-2 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);