import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PostEditor } from "@/components/PostEditor";
import { Category } from "@/hooks/useCategories";
import { Post } from "@/hooks/usePosts";

interface DashboardHeaderProps {
  categories: Category[];
  onSavePost: (post: Post) => void;
}

export function DashboardHeader({ categories, onSavePost }: DashboardHeaderProps) {
  return (
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
          <PostEditor onSubmit={onSavePost} categories={categories} />
        </SheetContent>
      </Sheet>
    </div>
  );
}