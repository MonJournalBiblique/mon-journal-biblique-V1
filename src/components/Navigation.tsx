import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, Home, Info, Mail, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
}

interface VisibilityState {
  about: boolean;
  contact: boolean;
  categories: boolean;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showBlogMenu, setShowBlogMenu] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState<VisibilityState>({
    about: true,
    contact: true,
    categories: true,
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
    };

    const storedVisibility = localStorage.getItem('frontendVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

    fetchCategories();
  }, []);

  const navItems = [
    { path: "/", label: t('nav.home'), icon: Home, alwaysShow: true },
    { path: "/about", label: t('nav.about'), icon: Info, showIf: visibility.about },
    { path: "/contact", label: t('nav.contact'), icon: Mail, showIf: visibility.contact },
  ].filter(item => item.alwaysShow || item.showIf);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
  ];

  return (
    <nav className="bg-background/40 backdrop-blur-md border-b border-gray-200/50">
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
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
            <div className="relative group">
              {visibility.categories && (
                <button
                  className="flex items-center text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setShowBlogMenu(!showBlogMenu)}
                >
                  {t('nav.blog')}
                </button>
              )}
              <div className={cn(
                "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 transition-all duration-200",
                showBlogMenu ? "opacity-100 visible" : "opacity-0 invisible"
              )}>
                <div className="py-1">
                  <Link
                    to="/blog"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                    onClick={() => setShowBlogMenu(false)}
                  >
                    All Posts
                  </Link>
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/blog/category/${category.id}`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10"
                      onClick={() => setShowBlogMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "cursor-pointer",
                      language === lang.code && "bg-primary/10"
                    )}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
      <div className={cn("sm:hidden", isOpen ? "block" : "hidden")}>
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
          {visibility.categories && categories.map(category => (
            <MobileNavLink
              key={category.id}
              to={`/blog/category/${category.id}`}
              onClick={toggleMenu}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              {category.name}
            </MobileNavLink>
          ))}
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                toggleMenu();
              }}
              className={cn(
                "w-full flex items-center px-3 py-2 text-foreground hover:bg-primary/10",
                language === lang.code && "bg-primary/10"
              )}
            >
              <Languages className="h-5 w-5 mr-2" />
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
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
    className="flex items-center text-foreground hover:text-primary hover:bg-primary/10 px-3 py-2 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);