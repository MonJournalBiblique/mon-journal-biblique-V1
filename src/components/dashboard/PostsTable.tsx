import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PenIcon, Trash2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { PostEditor } from "@/components/PostEditor";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Auteur</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
            </TableCell>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              {categories.find(cat => cat.id === post.categoryId)?.name || '-'}
            </TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>{new Date(post.date).toLocaleDateString("fr-FR")}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePublish(post.id)}
              >
                {post.published ? (
                  <EyeIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
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
                  onClick={() => onDeletePost(post.id)}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};