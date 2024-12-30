import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const footerChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'footer_content' },
        (payload) => {
          console.log('Footer content changed:', payload);
          window.dispatchEvent(new Event('footer-update'));
        }
      )
      .subscribe();

    const pagesChannel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        (payload) => {
          console.log('Pages content changed:', payload);
          window.dispatchEvent(new Event('pages-update'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(footerChannel);
      supabase.removeChannel(pagesChannel);
    };
  }, []);

  return <>{children}</>;
};