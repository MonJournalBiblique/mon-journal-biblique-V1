import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import CategoryPosts from "@/pages/CategoryPosts";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import { BlogPost } from "@/components/BlogPost";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog/category/:categoryId" element={<CategoryPosts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;