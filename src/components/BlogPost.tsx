import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from "./blog/PostHeader";
import { CommentSection } from "./blog/CommentSection";
import { RelatedPosts } from "./blog/RelatedPosts";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category_id?: string;
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
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { id: postId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

      if (data) {
        data.content = stripHtmlTags(data.content || "");
      }

      setPost(data);
      setIsLoading(false);
    };

    fetchPost();
  }, [postId, navigate, toast]);

  const translateContent = async () => {
    if (!post || isTranslating) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${i18n.language}&dt=t&q=${encodeURIComponent(post.content)}`);
      const data = await response.json();
      const translatedText = data[0].map((item: any[]) => item[0]).join(' ');
      setTranslatedContent(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: t('common.error'),
        description: "Failed to translate content",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

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

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={translateContent}
            disabled={isTranslating}
            className="flex items-center gap-2"
          >
            <Languages className="w-4 h-4" />
            {translatedContent ? t('blog.originalContent') : t('blog.translateContent')}
          </Button>
        </div>

        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          {translatedContent || post.content}
        </div>
      </article>

      <CommentSection postId={postId || ""} />
      <RelatedPosts currentPostId={postId || ""} categoryId={post?.category_id} />
    </div>
  );
};