import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PostEditor } from "@/components/PostEditor";
import { CategoryManager } from "@/components/CategoryManager";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";

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

const POSTS_PER_PAGE = 10;

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleSavePost = (data: Post) => {
    const postIndex = posts.findIndex(p => p.id === data.id);
    if (postIndex !== -1) {
      setPosts(posts.map((post, index) => 
        index === postIndex ? data : post
      ));
    } else {
      setPosts([data, ...posts]);
    }
  };

  const togglePublish = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, published: !post.published } : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleCategoryChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Tableau de Bord</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Nouveau Post</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Créer un Nouveau Post</SheetTitle>
            </SheetHeader>
            <PostEditor onSubmit={handleSavePost} categories={categories} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Gestion des Catégories</h2>
        <CategoryManager 
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <PostsTable
          posts={paginatedPosts}
          categories={categories}
          onTogglePublish={togglePublish}
          onDeletePost={deletePost}
          onSavePost={handleSavePost}
        />

        <DashboardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;