import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  categoryId?: string;
}

export const RelatedPosts = ({ currentPostId, categoryId }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!categoryId) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', categoryId)
        .eq('published', true)
        .neq('id', currentPostId)
        .limit(3);

      if (!error && data) {
        setPosts(data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.content?.substring(0, 100) || '',
          image: post.image || '/placeholder.svg'
        })));
      }
    };

    fetchRelatedPosts();
  }, [categoryId, currentPostId]);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-serif font-bold mb-8">{t('blog.relatedPosts', 'Articles Similaires')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden group animate-fade-in">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <CardContent className="p-4">
              <h3 className="font-serif font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
              <Link
                to={`/blog/${post.id}`}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                {t('blog.readMore')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};