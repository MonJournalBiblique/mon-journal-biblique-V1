import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface BlogPostProps {
  title: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export const BlogPost = ({ title, content, date, image, author }: BlogPostProps) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-4">
        <time className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
        <p className="text-gray-600">Par {author}</p>
        <img
          src={image}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
        <Button
          variant="outline"
          size="sm"
          className="mb-8"
          onClick={handleShare}
        >
          <Share2 className="mr-2" />
          Partager
        </Button>
        <div
          className="prose prose-lg prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
};