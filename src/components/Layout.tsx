import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-background flex items-center justify-center animate-fade-in">
          <div className="flex items-center gap-3 animate-fade-in">
            <img src="/logo.svg" alt="MJB Logo" className="h-12 w-12" />
            <span className="text-2xl font-serif">Mon Journal Biblique</span>
          </div>
        </div>
      )}
      
      <div className="bg-white/50 dark:bg-background/50 backdrop-blur-sm fixed w-full z-40 shadow-sm">
        <Navigation />
      </div>
      <main className="flex-grow pt-16">{children}</main>
      <footer className="bg-white/50 dark:bg-background/50 backdrop-blur-sm py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="container text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Mon Journal Biblique. Tous droits réservés.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};