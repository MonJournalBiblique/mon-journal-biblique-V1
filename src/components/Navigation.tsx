import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, Home, PenTool, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

interface Category {
  id: string;
  name: string;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showBlogMenu, setShowBlogMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={cn(
      "fixed w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BookOpen className={cn(
                "h-8 w-8 transition-colors",
                isScrolled ? "text-primary" : "text-white"
              )} />
              <span className={cn(
                "ml-2 font-serif text-xl font-semibold transition-colors",
                isScrolled ? "text-foreground dark:text-white" : "text-white"
              )}>MJB</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/" isScrolled={isScrolled}>Accueil</NavLink>
            <div className="relative group">
              <button
                className={cn(
                  "flex items-center transition-colors duration-200 font-medium",
                  isScrolled 
                    ? "text-gray-700 dark:text-gray-300 hover:text-primary" 
                    : "text-white hover:text-gray-200"
                )}
                onClick={() => setShowBlogMenu(!showBlogMenu)}
              >
                Blog
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className={cn(
                "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-200",
                showBlogMenu ? "opacity-100 visible" : "opacity-0 invisible"
              )}>
                <div className="py-1">
                  <Link
                    to="/blog"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowBlogMenu(false)}
                  >
                    All Posts
                  </Link>
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/blog/category/${category.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowBlogMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "ml-4",
                isScrolled ? "" : "text-white hover:text-gray-200"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className={cn(
                isScrolled ? "" : "text-white hover:text-gray-200"
              )}
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
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
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

const NavLink = ({ 
  to, 
  children,
  isScrolled 
}: { 
  to: string; 
  children: React.ReactNode;
  isScrolled: boolean;
}) => (
  <Link
    to={to}
    className={cn(
      "transition-colors duration-200 font-medium",
      isScrolled 
        ? "text-gray-700 dark:text-gray-300 hover:text-primary" 
        : "text-white hover:text-gray-200"
    )}
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
    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);
