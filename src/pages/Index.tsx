import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogCard } from "@/components/BlogCard";
import { useTranslation } from "react-i18next";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  author: string;
}

const heroImages = [
  "/lovable-uploads/bdb4c884-09f5-4c70-bd21-98a3a2170505.png",
  "/lovable-uploads/2762b88c-bdb3-4ab2-ba57-96451c0177b9.png",
  "/lovable-uploads/f695dc06-2bf6-41a3-bee5-2c294716efd3.png"
].map(src => ({
  src,
  loading: 'lazy' as const,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}));

const Index = () => {
  const { t } = useTranslation();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setRecentPosts(data);
    };

    fetchRecentPosts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={`Hero image ${index + 1}`}
                className="w-full h-full object-cover"
                loading={image.loading}
                sizes={image.sizes}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title', 'Mon Journal Biblique')}
            </h1>
            <p className="text-xl mb-8">
              {t('home.subtitle', 'Explorez la foi chrétienne à travers des réflexions profondes et des perspectives inspirantes.')}
            </p>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white text-white">
              <Link to="/blog">{t('home.discoverArticles', 'Découvrir les Articles')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {t('home.recentArticles', 'Articles Récents')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {recentPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content || ''}
                date={post.date}
                image={post.image}
                author={post.author}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.about', 'À Propos')}</h3>
              <p className="text-muted-foreground">
                {t('footer.aboutText', 'Mon Journal Biblique est votre compagnon quotidien pour explorer et approfondir votre foi.')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks', 'Liens Rapides')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary">
                    {t('nav.blog', 'Blog')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary">
                    {t('nav.about', 'À Propos')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary">
                    {t('nav.contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.contact', 'Contact')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: contact@monjournalbiblique.com</li>
                <li>{t('footer.phone', 'Téléphone')}: +33 1 23 45 67 89</li>
                <li>{t('footer.address', 'Adresse')}: Paris, France</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.followUs', 'Suivez-nous')}</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} {t('footer.copyright', 'Mon Journal Biblique. Tous droits réservés.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;