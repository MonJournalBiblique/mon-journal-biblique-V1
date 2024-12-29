import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const Index = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

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

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-secondary/50 dark:bg-secondary/20 relative min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg"
            alt="Bible ouverte"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mon Journal Biblique
            </h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              Explorez la foi chrétienne à travers des réflexions profondes et des
              perspectives inspirantes.
            </p>
            <Button asChild size="lg">
              <Link to="/blog">Découvrir les Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Articles Récents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                date={post.date}
                id={post.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 dark:bg-background/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">À Propos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mon Journal Biblique est votre compagnon quotidien pour explorer et approfondir votre foi.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Email: contact@monjournalbiblique.com</li>
                <li>Téléphone: +33 1 23 45 67 89</li>
                <li>Adresse: Paris, France</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Twitter
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Mon Journal Biblique. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PostCard = ({
  title,
  excerpt,
  date,
  id,
}: {
  title: string;
  excerpt: string;
  date: string;
  id: string;
}) => (
  <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <div className="p-6">
      <time className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h3 className="text-xl font-bold mb-2 mt-1">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{excerpt}</p>
      <Button variant="link" className="p-0" asChild>
        <Link to={`/blog/${id}`}>Lire la suite →</Link>
      </Button>
    </div>
  </article>
);

export default Index;