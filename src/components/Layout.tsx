import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface FooterContent {
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [visibility, setVisibility] = useState({
    about: true,
    quickLinks: true,
    contact: true,
    social: true
  });
  const { t } = useTranslation();

  const fetchFooterContent = async () => {
    const { data } = await supabase
      .from('footer_content')
      .select('*')
      .single();

    if (data) {
      setFooterContent(data);
    }
  };

  useEffect(() => {
    const storedVisibility = localStorage.getItem('footerVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

    fetchFooterContent();

    // Listen for footer content updates
    window.addEventListener('footer-update', fetchFooterContent);

    return () => {
      window.removeEventListener('footer-update', fetchFooterContent);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="nav-modern fixed w-full z-40">
        <Navigation />
      </div>
      <main className="flex-grow pt-16">{children}</main>
      <footer className="bg-card text-card-foreground border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {visibility.about && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('footer.about')}</h3>
                <p className="text-muted-foreground">
                  {footerContent?.about_text || t('footer.aboutText')}
                </p>
              </div>
            )}

            {visibility.quickLinks && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/blog" className="text-muted-foreground hover:text-primary">
                      {t('nav.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-muted-foreground hover:text-primary">
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-muted-foreground hover:text-primary">
                      {t('nav.contact')}
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {visibility.contact && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Email: {footerContent?.contact_email}</li>
                  <li>{t('footer.phone')}: {footerContent?.contact_phone}</li>
                  <li>{t('footer.address')}: {footerContent?.contact_address}</li>
                </ul>
              </div>
            )}

            {visibility.social && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
                <div className="flex space-x-4">
                  {footerContent?.social_facebook && (
                    <a href={footerContent.social_facebook} className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  )}
                  {footerContent?.social_twitter && (
                    <a href={footerContent.social_twitter} className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  )}
                  {footerContent?.social_instagram && (
                    <a href={footerContent.social_instagram} className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};