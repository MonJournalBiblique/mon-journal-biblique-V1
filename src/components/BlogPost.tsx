import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from "./blog/PostHeader";
import { CommentSection } from "./blog/CommentSection";
import { RelatedPosts } from "./blog/RelatedPosts";

interface BlogPostProps {
  title: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Sample related posts - in a real app, these would come from your backend
const relatedPosts = [
  {
    id: "2",
    title: "La Foi dans les Moments Difficiles",
    excerpt: "Comment maintenir sa foi pendant les périodes d'épreuve...",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  },
  {
    id: "3",
    title: "L'Importance de la Prière Quotidienne",
    excerpt: "Découvrez comment la prière peut transformer votre vie...",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
  },
  {
    id: "4",
    title: "Comprendre les Écritures",
    excerpt: "Un guide pratique pour mieux comprendre la Bible...",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
  },
];

export const BlogPost = ({ title, content, date, image, author }: BlogPostProps) => {
  const [comments, setComments] = useState([]);
  const { id: postId } = useParams();
  const { toast } = useToast();
  const readingTime = calculateReadingTime(content);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      setComments(data || []);
    };

    fetchComments();
  }, [postId]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content.substring(0, 100) + "...",
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
          title={title}
          date={date}
          author={author}
          readingTime={readingTime}
          image={image}
          onShare={handleShare}
        />

        <div
          className="prose prose-lg prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      <CommentSection postId={postId || ""} comments={comments} />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
};