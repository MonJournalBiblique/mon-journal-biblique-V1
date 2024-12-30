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
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";

type Page = Tables<'pages'>

interface PageForm {
  content: string;
}

export const PageEditor = ({ slug }: { slug: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<PageForm>({
    defaultValues: {
      content: "",
    },
  });

  const { data: page, isLoading } = useQuery({
    queryKey: ['pages', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No page found, create it
          const newPage = {
            slug,
            title: slug === 'about' ? 'À Propos' : 'Contact',
            content: '',
          };
          
          const { data: createdPage, error: createError } = await supabase
            .from('pages')
            .insert(newPage)
            .select()
            .single();
            
          if (createError) throw createError;
          return createdPage;
        }
        throw error;
      }
      
      form.reset({ content: data.content || '' });
      return data as Page;
    },
  });

  const updatePage = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('pages')
        .update({ content, last_updated: new Date().toISOString() })
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

  const onSubmit = (data: PageForm) => {
    updatePage.mutate(data.content);
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              disabled={updatePage.isPending}
            >
              {updatePage.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};