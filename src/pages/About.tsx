import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ['pages', 'about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Skeleton className="h-12 w-1/3 mb-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif font-bold text-primary mb-8">{page?.title}</h1>
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page?.content || '' }}
      />
    </div>
  );
};

export default About;