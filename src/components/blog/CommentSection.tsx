import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
  name: string;
}

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      const { data: commentsData, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      setComments(commentsData || []);
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !name.trim()) {
      toast({
        title: "Error",
        description: "Please provide both your name and comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert([
        {
          post_id: postId,
          content: newComment,
          name: name,
          author: "Anonymous", // Replace with actual user name when auth is implemented
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your comment has been added",
      });

      setNewComment("");
      setName("");
      
      // Refresh comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      setComments(commentsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to add your comment",
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
        Comments
      </h2>

      <div className="space-y-4">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-md"
        />
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim() || !name.trim()}
        >
          Publish
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar>
                  <AvatarFallback>{comment.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{comment.name}</p>
                  <time className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};