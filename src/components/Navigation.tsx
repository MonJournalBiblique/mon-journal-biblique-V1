import { useState, useEffect } from "react";
import { Home, Info, Mail, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Logo } from "./navigation/Logo";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { MobileMenuButton } from "./navigation/MobileMenuButton";

interface Category {
  id: string;
  name: string;
}

interface VisibilityState {
  about: boolean;
  contact: boolean;
  categories: boolean;
}

const ADMIN_EMAILS = [
  'michele.pouobang@gmail.com',
  'kamguiac@gmail.com',
  'guy.christian.kamguia@gmail.com'
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [visibility, setVisibility] = useState<VisibilityState>({
    about: true,
    contact: true,
    categories: true,
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
    };

    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    const storedVisibility = localStorage.getItem('frontendVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

    fetchCategories();
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { path: "/", label: t('nav.home'), icon: Home, showIf: true },
    { path: "/about", label: t('nav.about'), icon: Info, showIf: visibility.about },
    { path: "/contact", label: t('nav.contact'), icon: Mail, showIf: visibility.contact },
    { path: "/dashboard", label: "Dashboard", icon: Shield, showIf: isAdmin },
  ];

  return (
    <nav className="bg-background/40 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Logo isAdmin={isAdmin} />

          <DesktopMenu
            navItems={navItems}
            categories={categories}
            isVisible={visibility.categories}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />

          <MobileMenuButton 
            isOpen={isOpen} 
            toggleMenu={toggleMenu} 
          />
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        navItems={navItems}
        categories={categories}
        isVisible={visibility.categories}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        toggleMenu={toggleMenu}
      />
    </nav>
  );
};