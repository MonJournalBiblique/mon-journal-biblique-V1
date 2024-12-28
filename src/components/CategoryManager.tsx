import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoryChange: (categories: Category[]) => void;
}

export function CategoryManager({ categories, onCategoryChange }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const category = {
      id: crypto.randomUUID(),
      name: newCategory.trim()
    };
    
    onCategoryChange([...categories, category]);
    setNewCategory("");
    toast.success("Catégorie ajoutée");
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const saveEdit = (id: string) => {
    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, name: editValue.trim() } : cat
    );
    onCategoryChange(updatedCategories);
    setEditingId(null);
    toast.success("Catégorie mise à jour");
  };

  const deleteCategory = (id: string) => {
    onCategoryChange(categories.filter(cat => cat.id !== id));
    toast.success("Catégorie supprimée");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addCategory()}
        />
        <Button onClick={addCategory}>Ajouter</Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2">
            {editingId === category.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" onClick={() => saveEdit(category.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{category.name}</span>
                <Button size="icon" variant="ghost" onClick={() => startEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteCategory(category.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}