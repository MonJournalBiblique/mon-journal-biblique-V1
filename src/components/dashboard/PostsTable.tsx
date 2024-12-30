import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

      // Refresh the page to show the new post
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

  const handleDeleteConfirm = (postId: string) => {
    setPostToDelete(postId);
  };

  const handleDeleteCancel = () => {
    setPostToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    if (postToDelete) {
      onDeletePost(postToDelete);
      setPostToDelete(null);
    }
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-gray-700">
            <TableHead className="dark:text-gray-300">Image</TableHead>
            <TableHead className="dark:text-gray-300">Titre</TableHead>
            <TableHead className="dark:text-gray-300">Catégorie</TableHead>
            <TableHead className="dark:text-gray-300">Auteur</TableHead>
            <TableHead className="dark:text-gray-300">Date</TableHead>
            <TableHead className="dark:text-gray-300">Statut</TableHead>
            <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="dark:border-gray-700">
              <TableCell className="dark:text-gray-300">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium dark:text-gray-300">{post.title}</TableCell>
              <TableCell className="dark:text-gray-300">
                {categories.find(cat => cat.id === post.categoryId)?.name || '-'}
              </TableCell>
              <TableCell className="dark:text-gray-300">{post.author}</TableCell>
              <TableCell className="dark:text-gray-300">
                {new Date(post.date).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePublish(post.id)}
                >
                  {post.published ? (
                    <EyeIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(post.id)}
                  >
                    <CopyIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <PenIcon className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[90vw] sm:max-w-2xl overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Modifier le Post</SheetTitle>
                      </SheetHeader>
                      <PostEditor 
                        post={post} 
                        onSubmit={onSavePost}
                        categories={categories}
                      />
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteConfirm(post.id)}
                  >
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce post ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le post sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};