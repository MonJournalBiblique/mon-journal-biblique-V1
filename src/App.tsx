import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CategoryPosts from "@/pages/CategoryPosts";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import { BlogPost } from "@/components/BlogPost";
import { useEffect, useState } from "react";
import "@/i18n/config";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

function App() {
  const [visibility, setVisibility] = useState<VisibilityState>({
    about: true,
    contact: true,
    categories: true,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedVisibility = localStorage.getItem('frontendVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

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
          setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to real-time changes for footer_content
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

    // Subscribe to real-time changes for pages
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

    const handleVisibilityChange = (event: Event) => {
      const customEvent = event as CustomEvent<VisibilityState>;
      setVisibility(customEvent.detail);
    };

    window.addEventListener('visibilityChange', handleVisibilityChange as EventListener);
    window.addEventListener('storage', (e) => {
      if (e.key === 'frontendVisibility' && e.newValue) {
        setVisibility(JSON.parse(e.newValue));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        localStorage.removeItem('supabase.auth.token');
      } else if (session?.user) {
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      }
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(footerChannel);
      supabase.removeChannel(pagesChannel);
      window.removeEventListener('visibilityChange', handleVisibilityChange as EventListener);
    };
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route 
            path="/blog/category/:categoryId" 
            element={visibility.categories ? <CategoryPosts /> : <Navigate to="/" />} 
          />
          <Route 
            path="/about" 
            element={visibility.about ? <About /> : <Navigate to="/" />} 
          />
          <Route 
            path="/contact" 
            element={visibility.contact ? <Contact /> : <Navigate to="/" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAdmin ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;