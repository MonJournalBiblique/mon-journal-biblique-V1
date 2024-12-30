import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

type Page = Tables<'pages'>

export const PageEditor = ({ slug }: { slug: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: page, isLoading } = useQuery({
    queryKey: ['pages', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      setContent(data.content || '');
      return data as Page;
    },
  });

  const updatePage = useMutation({
    mutationFn: async (newContent: string) => {
      const { error } = await supabase
        .from('pages')
        .update({ content: newContent, last_updated: new Date().toISOString() })
        .eq('slug', slug);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', slug] });
      toast({
        title: "Page mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
      console.error('Error updating page:', error);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{page?.title}</CardTitle>
        <CardDescription>
          Dernière mise à jour: {new Date(page?.last_updated || '').toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RichTextEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />
        <Button 
          onClick={() => updatePage.mutate(content)}
          disabled={updatePage.isPending}
        >
          {updatePage.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
};