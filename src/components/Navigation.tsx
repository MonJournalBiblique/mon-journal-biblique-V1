import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, Home, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { NavLink } from "./navigation/NavLink";
import { MobileNavLink } from "./navigation/MobileNavLink";
import { LanguageSwitcher } from "./navigation/LanguageSwitcher";
import { BlogMenu } from "./navigation/BlogMenu";

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
            
            <BlogMenu categories={categories} isVisible={visibility.categories} />
            <LanguageSwitcher />
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
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
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
        </div>
      </div>
    </nav>
  );
};