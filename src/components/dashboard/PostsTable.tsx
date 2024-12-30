import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PenIcon, Trash2Icon, EyeIcon, EyeOffIcon, CopyIcon } from "lucide-react";
import { PostEditor } from "@/components/PostEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  published: boolean;
  date: string;
  author: string;
  content?: string;
  image?: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

interface PostsTableProps {
  posts: Post[];
  categories: Category[];
  onTogglePublish: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onSavePost: (post: Post) => void;
}

export const PostsTable = ({
  posts,
  categories,
  onTogglePublish,
  onDeletePost,
  onSavePost,
}: PostsTableProps) => {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const { toast } = useToast();

  const handleDuplicate = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('post_duplications')
        .insert({ original_id: postId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post duplicated successfully",
      });

      window.location.reload();
    } catch (error: any) {
      console.error('Error duplicating post:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className="table-header">
            <TableHead className="text-contrast-high">Image</TableHead>
            <TableHead className="text-contrast-high">Titre</TableHead>
            <TableHead className="text-contrast-high">Catégorie</TableHead>
            <TableHead className="text-contrast-high">Auteur</TableHead>
            <TableHead className="text-contrast-high">Date</TableHead>
            <TableHead className="text-contrast-high">Statut</TableHead>
            <TableHead className="text-right text-contrast-high">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="table-row">
              <TableCell className="table-cell">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="table-cell font-medium">{post.title}</TableCell>
              <TableCell className="table-cell">
                {categories.find(cat => cat.id === post.categoryId)?.name || '-'}
              </TableCell>
              <TableCell className="table-cell">{post.author}</TableCell>
              <TableCell className="table-cell">
                {new Date(post.date).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePublish(post.id)}
                  className="hover:bg-muted/20"
                >
                  {post.published ? (
                    <EyeIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(post.id)}
                    className="hover:bg-muted/20"
                  >
                    <CopyIcon className="h-4 w-4 text-primary" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPostToEdit(post)}
                    className="hover:bg-muted/20"
                  >
                    <PenIcon className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPostToDelete(post.id)}
                    className="hover:bg-destructive/20"
                  >
                    <Trash2Icon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!postToEdit} onOpenChange={() => setPostToEdit(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Post</DialogTitle>
          </DialogHeader>
          {postToEdit && (
            <PostEditor 
              post={postToEdit} 
              onSubmit={(updatedPost) => {
                onSavePost(updatedPost);
                setPostToEdit(null);
              }}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Êtes-vous sûr de vouloir supprimer ce post ?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Cette action est irréversible. Le post sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/90">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (postToDelete) {
                  onDeletePost(postToDelete);
                  setPostToDelete(null);
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};