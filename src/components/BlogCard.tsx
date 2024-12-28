import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  author: string;
}

export const BlogCard = ({ id, title, content, date, image, author }: BlogCardProps) => {
  const excerpt = content ? content.slice(0, 150) + "..." : "";

  return (
    <Card className="h-full flex flex-col">
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardContent className="flex-grow p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Clock className="h-4 w-4" />
          <time>
            {new Date(date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <p className="text-sm text-gray-500">Par {author}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/blog/${id}`}>Lire la suite</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};