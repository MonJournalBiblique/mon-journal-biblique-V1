import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
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