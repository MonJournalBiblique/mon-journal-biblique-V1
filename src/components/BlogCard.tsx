import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

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
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { t, i18n } = useTranslation();

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

  const translateContent = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${i18n.language}&dt=t&q=${encodeURIComponent(content)}`);
      const data = await response.json();
      const translatedText = data[0].map((item: any[]) => item[0]).join(' ');
      setTranslatedContent(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="group overflow-hidden border-none bg-transparent">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
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
            <span>{t('blog.by')}</span>
            <span className="font-medium">{author}</span>
          </div>
          <time>
            {new Date(date).toLocaleDateString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {translatedContent || content?.replace(/<[^>]*>/g, '')}
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to={`/blog/${id}`}
            className="inline-block px-6 py-2 bg-white text-primary border-2 border-primary rounded 
                     hover:bg-primary hover:text-white transition-all duration-300"
          >
            {t('blog.readMore')}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={translateContent}
            disabled={isTranslating}
            className="flex items-center gap-2"
          >
            <Languages className="w-4 h-4" />
            {translatedContent ? t('blog.originalContent') : t('blog.translateContent')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};