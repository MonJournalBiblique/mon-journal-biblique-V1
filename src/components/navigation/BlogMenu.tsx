import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
}

interface BlogMenuProps {
  categories: Category[];
  isVisible: boolean;
}

export const BlogMenu = ({ categories, isVisible }: BlogMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="relative group">
      <button
        className="flex items-center text-foreground hover:text-primary transition-colors duration-200 font-medium"
        onClick={() => setShowMenu(!showMenu)}
      >
        {t('nav.blog')}
      </button>
      <div
        className={cn(
          "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 transition-all duration-200",
          showMenu ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="py-1">
          <Link
            to="/blog"
            className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10"
            onClick={() => setShowMenu(false)}
          >
            All posts
          </Link>
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/blog/category/${category.id}`}
              className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10"
              onClick={() => setShowMenu(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};