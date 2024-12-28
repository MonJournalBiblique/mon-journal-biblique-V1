import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: postId,
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
    } catch (error: any) {
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
  );
};