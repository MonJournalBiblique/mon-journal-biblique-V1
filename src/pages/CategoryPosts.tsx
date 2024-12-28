import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";

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

      // Fetch category details
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryData) {
        setCategory(categoryData);
      }

      // Fetch posts for this category
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
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">
        {category?.name || 'Category'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
        {posts.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPosts;