import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="nav-modern fixed w-full z-40">
        <Navigation />
      </div>
      <main className="flex-grow pt-16">{children}</main>
      <footer className="nav-modern py-8">
        <div className="container text-center">
          <p className="text-contrast-medium">
            © {new Date().getFullYear()} Mon Journal Biblique. Tous droits réservés.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};