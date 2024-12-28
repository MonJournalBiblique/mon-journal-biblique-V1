import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { PostEditor } from "@/components/PostEditor";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PenIcon, Trash2Icon, EyeIcon, EyeOffIcon } from "lucide-react";

interface Post {
  id: string;
  title: string;
  published: boolean;
  date: string;
  author: string;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "La Prière dans la Vie Quotidienne",
      published: true,
      date: "2024-02-20",
      author: "Marie Dubois",
    },
    {
      id: "2",
      title: "L'Importance de la Foi",
      published: false,
      date: "2024-02-21",
      author: "Jean Martin",
    },
  ]);

  const togglePublish = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, published: !post.published } : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Tableau de Bord</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Nouveau Post</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>Créer un Nouveau Post</SheetTitle>
            </SheetHeader>
            <PostEditor />
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish(post.id)}
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
                      <SheetContent className="w-[90vw] sm:max-w-2xl">
                        <SheetHeader>
                          <SheetTitle>Modifier le Post</SheetTitle>
                        </SheetHeader>
                        <PostEditor post={post} />
                      </SheetContent>
                    </Sheet>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;