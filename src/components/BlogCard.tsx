import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  author: string;
  category_id?: string;
}

export const BlogCard = ({ id, title, content, date, image, author, category_id }: BlogCardProps) => {
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchCategory = async () => {
      if (category_id) {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .eq('id', category_id)
          .single();

        if (!error && data) {
          setCategoryName(data.name);
        }
      }
    };

    fetchCategory();
  }, [category_id]);

  return (
    <Card className="group overflow-hidden border-none bg-transparent">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-0">
        {categoryName && (
          <div className="mb-3">
            <span className="text-sm text-primary uppercase tracking-wider">{categoryName}</span>
          </div>
        )}
        <Link to={`/blog/${id}`}>
          <h3 className="text-2xl font-serif font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <span>BY</span>
            <span className="font-medium">{author}</span>
          </div>
          <time>
            {new Date(date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {content?.replace(/<[^>]*>/g, '')}
        </p>
        <Link 
          to={`/blog/${id}`}
          className="inline-block px-6 py-2 bg-white text-primary border-2 border-primary rounded 
                   hover:bg-primary hover:text-white transition-all duration-300"
        >
          READ MORE
        </Link>
      </CardContent>
    </Card>
  );
};