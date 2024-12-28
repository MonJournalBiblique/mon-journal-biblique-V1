import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CategoryManager } from "@/components/CategoryManager";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";

const POSTS_PER_PAGE = 10;

const Dashboard = () => {
  const { posts, isLoading, savePost, togglePublish, deletePost } = usePosts();
  const { categories, refreshCategories } = useCategories();
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

  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardHeader 
        categories={categories}
        onSavePost={savePost}
      />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Gestion des Catégories</h2>
        <CategoryManager 
          categories={categories}
          onCategoryChange={refreshCategories}
        />
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            <PostsTable
              posts={paginatedPosts}
              categories={categories}
              onTogglePublish={togglePublish}
              onDeletePost={deletePost}
              onSavePost={savePost}
            />

            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;