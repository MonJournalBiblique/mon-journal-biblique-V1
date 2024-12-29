import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from "./blog/PostHeader";
import { CommentSection } from "./blog/CommentSection";
import { RelatedPosts } from "./blog/RelatedPosts";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image: string;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export const BlogPost = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id: postId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load the post",
          variant: "destructive",
        });
        navigate("/blog");
        return;
      }

      // Strip HTML tags from the content preview
      if (data) {
        data.content = stripHtmlTags(data.content || "");
      }

      setPost(data);
      setIsLoading(false);
    };

    fetchPost();
  }, [postId, navigate, toast]);

  if (isLoading || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: stripHtmlTags(post.content).substring(0, 100) + "...",
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <article className="space-y-4">
        <PostHeader
          title={post.title}
          date={post.date}
          author={post.author}
          readingTime={readingTime}
          image={post.image}
          onShare={handleShare}
        />

        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          {post.content}
        </div>
      </article>

      <CommentSection postId={postId || ""} />
      <RelatedPosts posts={[]} />
    </div>
  );
};