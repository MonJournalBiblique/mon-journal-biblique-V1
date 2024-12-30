import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";
import { FooterContent } from "./footer/FooterContent";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [visibility, setVisibility] = useState({
    about: true,
    quickLinks: true,
    contact: true,
    social: true
  });
  const { t } = useTranslation();

  useEffect(() => {
    const storedVisibility = localStorage.getItem('footerVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="nav-modern fixed w-full z-40">
        <Navigation />
      </div>
      <main className="flex-grow pt-16">{children}</main>
      <footer className="bg-card text-card-foreground border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <FooterContent visibility={visibility} />
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};