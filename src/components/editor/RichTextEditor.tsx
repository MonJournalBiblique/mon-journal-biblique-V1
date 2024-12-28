import { Editor } from '@tinymce/tinymce-react';
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <FormItem>
      <FormLabel>Contenu</FormLabel>
      <FormControl>
        <Editor
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