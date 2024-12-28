import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Post {
  id: string;
  title: string;
  published: boolean;
  date: string;
  author: string;
  content?: string;
  image?: string;
  categoryId?: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const savePost = async (post: Post) => {
    try {
      const postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        date: post.date,
        author: post.author,
        image: post.image,
        category_id: post.categoryId // Match the database column name
      };

      const { error } = await supabase
        .from('posts')
        .upsert(postData, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post saved successfully",
      });
      
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
      return false;
    }
  };

  const togglePublish = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return false;

      const { error } = await supabase
        .from('posts')
        .update({ published: !post.published })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${post.published ? 'unpublished' : 'published'} successfully`,
      });
      
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error toggling post publish state:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update post status",
        variant: "destructive",
      });
      return false;
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
      
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    posts,
    isLoading,
    savePost,
    togglePublish,
    deletePost,
  };
}