import { Navigation } from "./Navigation";
import { Toaster } from "@/components/ui/toaster";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <footer className="bg-secondary py-8">
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