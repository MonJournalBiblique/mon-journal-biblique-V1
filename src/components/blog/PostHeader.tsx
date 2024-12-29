import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Share2 } from "lucide-react";

interface PostHeaderProps {
  title: string;
  date: string;
  author: string;
  readingTime: number;
  image: string;
  onShare: () => void;
}

export const PostHeader = ({ 
  title, 
  date, 
  author, 
  readingTime, 
  image, 
  onShare 
}: PostHeaderProps) => {
  return (
    <div className="space-y-4">
      <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Retour aux articles
      </Link>

      <time className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      
      <h1 className="text-4xl font-serif font-bold mb-4 dark:text-white">{title}</h1>
      
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <p>Par {author}</p>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{readingTime} min de lecture</span>
        </div>
      </div>

      <img
        src={image}
        alt={title}
        className="w-full h-[400px] object-cover rounded-lg mb-8 hover:scale-[1.02] transition-transform duration-300"
      />

      <Button
        variant="outline"
        size="sm"
        className="mb-8"
        onClick={onShare}
      >
        <Share2 className="mr-2" />
        Partager
      </Button>
    </div>
  );
};