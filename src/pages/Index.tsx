import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-secondary relative min-h-[600px] flex items-center">
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
            <p className="text-xl mb-8 text-gray-700">
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
            <PostCard
              title="La Prière dans la Vie Quotidienne"
              excerpt="Découvrez comment intégrer la prière dans votre routine quotidienne..."
              date="2024-02-20"
            />
            <PostCard
              title="Comprendre les Paraboles"
              excerpt="Une exploration approfondie des enseignements à travers les paraboles..."
              date="2024-02-18"
            />
            <PostCard
              title="La Foi en Temps de Crise"
              excerpt="Comment maintenir et renforcer sa foi pendant les moments difficiles..."
              date="2024-02-15"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Restez Connecté
            </h2>
            <p className="mb-8">
              Recevez nos derniers articles et réflexions directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-md text-gray-900 min-w-[300px]"
              />
              <Button variant="secondary">S'abonner</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

const PostCard = ({
  title,
  excerpt,
  date,
}: {
  title: string;
  excerpt: string;
  date: string;
}) => (
  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <div className="p-6">
      <time className="text-sm text-gray-500">
        {new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h3 className="text-xl font-bold mb-2 mt-1">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <Button variant="link" className="p-0" asChild>
        <Link to="/blog">Lire la suite →</Link>
      </Button>
    </div>
  </article>
);

export default Index;