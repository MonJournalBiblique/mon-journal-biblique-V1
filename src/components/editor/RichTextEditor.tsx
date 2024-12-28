import { Editor } from '@tinymce/tinymce-react';
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data: { TINYMCE_API_KEY }, error } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'TINYMCE_API_KEY' }
        });
        
        if (error) {
          console.error('Error fetching TinyMCE API key:', error);
          return;
        }
        
        setApiKey(TINYMCE_API_KEY);
      } catch (error) {
        console.error('Failed to fetch API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoading) {
    return <div className="h-[500px] flex items-center justify-center">Loading editor...</div>;
  }

  if (!apiKey) {
    return <div className="h-[500px] flex items-center justify-center">Failed to load editor. Please check your API key configuration.</div>;
  }

  return (
    <FormItem>
      <FormLabel>Contenu</FormLabel>
      <FormControl>
        <Editor
          apiKey={apiKey}
          value={value}
          onEditorChange={(content) => onChange(content)}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            // Add these settings for domain verification
            content_css: 'default',
            skin: 'oxide',
            promotion: false,
            setup: (editor) => {
              editor.on('init', () => {
                console.log('TinyMCE Editor initialized');
              });
            }
          }}
        />
      </FormControl>
    </FormItem>
  );
}