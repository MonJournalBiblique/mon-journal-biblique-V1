import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PostEditor } from "@/components/PostEditor";
import { CategoryManager } from "@/components/CategoryManager";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  title: string;
  published: boolean;
  date: string;
  author: string;
  content?: string;
  image?: string;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
}

const POSTS_PER_PAGE = 10;

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const handleSavePost = async (data: Post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .upsert({
          id: data.id,
          title: data.title,
          content: data.content,
          published: data.published,
          date: data.date,
          author: data.author,
          image: data.image,
          category_id: data.category_id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post saved successfully",
      });
      
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !post.published })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${post.published ? 'unpublished' : 'published'} successfully`,
      });
      
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error toggling post publish state:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Tableau de Bord</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Nouveau Post</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Créer un Nouveau Post</SheetTitle>
            </SheetHeader>
            <PostEditor onSubmit={handleSavePost} categories={categories} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Gestion des Catégories</h2>
        <CategoryManager 
          categories={categories}
          onCategoryChange={fetchCategories}
        />
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            <PostsTable
              posts={paginatedPosts}
              categories={categories}
              onTogglePublish={togglePublish}
              onDeletePost={deletePost}
              onSavePost={handleSavePost}
            />

            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;