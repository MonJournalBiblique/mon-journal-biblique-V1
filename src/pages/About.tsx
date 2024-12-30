import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

type Page = Tables<'pages'>

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
      return data as Page;
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-8 text-center">
            {page?.title}
          </h1>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 sm:p-10">
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page?.content || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;