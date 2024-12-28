import { Share2, Clock, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostProps {
  title: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Sample related posts - in a real app, these would come from your backend
const relatedPosts: RelatedPost[] = [
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
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const readingTime = calculateReadingTime(content);

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

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: window.location.pathname.split('/').pop(),
            content: newComment,
            author: "Anonymous", // Replace with actual user name when auth is implemented
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre commentaire a été ajouté",
      });

      setNewComment("");
      // Refresh comments
      // You would typically fetch the updated comments here
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <article className="space-y-4">
        <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour aux articles
        </Link>

        <time className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        
        <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <p>Par {author}</p>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min de lecture</span>
          </div>
        </div>

        <img
          src={image}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg mb-8 hover:scale-[1.02] transition-transform duration-300"
        />

        <Button
          variant="outline"
          size="sm"
          className="mb-8"
          onClick={handleShare}
        >
          <Share2 className="mr-2" />
          Partager
        </Button>

        <div
          className="prose prose-lg prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      {/* Comments Section */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Commentaires
        </h2>

        <div className="space-y-4">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            Publier
          </Button>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <time className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-serif font-bold mb-8">Articles Similaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden group animate-fade-in">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <CardContent className="p-4">
                <h3 className="font-serif font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                >
                  Lire la suite
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};