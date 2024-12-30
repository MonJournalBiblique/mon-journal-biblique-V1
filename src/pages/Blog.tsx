import { useState, useEffect } from "react";
import { BlogCard } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid2X2, Grid3X3 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  published: boolean;
  category_id?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState(2);
  const postsPerPage = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

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
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div 
        className="relative h-[40vh] flex items-center justify-center mb-16"
        style={{
          backgroundImage: 'url("/lovable-uploads/abd47df6-af6a-4492-bac0-cdd553d52bae.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Blog</h1>
          <p className="text-xl opacity-90">{posts.length} Articles publiés</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex justify-end gap-2 mb-6">
          <Button
            variant={gridSize === 2 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(2)}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 3 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(3)}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridSize === 4 ? "default" : "outline"}
            size="icon"
            onClick={() => setGridSize(4)}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <div className={`grid ${getGridClass()} gap-8`}>
          {currentPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
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

export default Blog;