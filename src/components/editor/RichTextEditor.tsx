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

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { TINYMCE_API_KEY }, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'TINYMCE_API_KEY' }
      });
      
      if (error) {
        console.error('Error fetching TinyMCE API key:', error);
        return;
      }
      
      setApiKey(TINYMCE_API_KEY);
    };

    fetchApiKey();
  }, []);

  if (!apiKey) {
    return <div>Loading editor...</div>;
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
          }}
        />
      </FormControl>
    </FormItem>
  );
}