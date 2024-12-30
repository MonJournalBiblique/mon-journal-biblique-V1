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

  // Keep-alive effect
  useEffect(() => {
    const keepAlive = setInterval(() => {
      fetch(window.location.href).catch(() => {
        // Silent catch
      });
    }, 240000); // 4 minutes

    return () => clearInterval(keepAlive);
  }, []);

  // Original authentication effect
  useEffect(() => {
    const storedVisibility = localStorage.getItem('frontendVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ''));
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
