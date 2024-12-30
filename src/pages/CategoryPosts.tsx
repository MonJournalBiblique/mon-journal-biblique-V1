import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Grid2x2, Grid3x3, Grid4x4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState(2);
  const postsPerPage = 4;

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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGridClass = () => {
    switch (gridSize) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

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

        <div className="flex justify-end gap-2 mb-6">
          <Button
            variant={gridSize === 2 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(2)}
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 3 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(3)}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 4 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(4)}
          >
            <Grid4x4 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className={`grid ${getGridClass()} gap-8`}>
          {currentPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
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

        {posts.length > postsPerPage && (
          <div className="mt-8">
            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPosts;