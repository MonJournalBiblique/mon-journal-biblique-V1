import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { RichTextEditor } from "./editor/RichTextEditor";
import { ImageUpload } from "./editor/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    published: boolean;
    date: string;
    author: string;
    content?: string;
    image?: string;
    categoryId?: string;
  };
  categories: Category[];
  onSubmit: (data: any) => void;
}

export function PostEditor({ post, categories, onSubmit }: PostEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(post?.image || '');

  const form = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      author: post?.author || "",
      published: post?.published || false,
      image: post?.image || "",
      categoryId: post?.categoryId || "",
    },
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        date: post?.date || new Date().toISOString(),
        id: post?.id || crypto.randomUUID(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du post" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <ImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={(content) => field.onChange(content)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'auteur" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Publier immédiatement</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
}