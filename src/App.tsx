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
import { useState } from "react";
import "@/i18n/config";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";

interface VisibilityState {
  about: boolean;
  contact: boolean;
  categories: boolean;
}

function App() {
  const [visibility, setVisibility] = useState<VisibilityState>({
    about: true,
    contact: true,
    categories: true,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <AuthProvider onAuthChange={setIsAdmin}>
        <RealtimeProvider>
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
        </RealtimeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;