import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  published: boolean;
}

interface Category {
  id: string;
  name: string;
}

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      setIsLoading(true);

      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryData) {
        setCategory(categoryData);
      }

      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', categoryId)
        .eq('published', true)
        .order('date', { ascending: false });

      setPosts(postsData || []);
      setIsLoading(false);
    };

    if (categoryId) {
      fetchCategoryAndPosts();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="container-modern py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            {category?.name || 'Category'}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of articles about {category?.name.toLowerCase()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {posts.map((post) => (
            <div key={post.id} className="card-hover-effect">
              <BlogCard {...post} />
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-gray-600">
                  We haven't published any posts in this category yet. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPosts;