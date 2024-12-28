import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <Navigation />
      </div>
      <main className="flex-grow pt-16">{children}</main>
      <footer className="bg-white/80 backdrop-blur-sm py-8">
        <div className="container text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Mon Journal Biblique. Tous droits réservés.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};