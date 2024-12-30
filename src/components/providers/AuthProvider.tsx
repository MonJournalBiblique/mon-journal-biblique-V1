import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAILS = [
  'michele.pouobang@gmail.com',
  'kamguiac@gmail.com',
  'guy.christian.kamguia@gmail.com'
];

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthChange: (isAdmin: boolean) => void;
}

export const AuthProvider = ({ children, onAuthChange }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          return;
        }

        if (session?.user) {
          onAuthChange(ADMIN_EMAILS.includes(session.user.email || ''));
        } else {
          onAuthChange(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        onAuthChange(false);
        localStorage.removeItem('supabase.auth.token');
      } else if (session?.user) {
        onAuthChange(ADMIN_EMAILS.includes(session.user.email || ''));
      }
    });

    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};