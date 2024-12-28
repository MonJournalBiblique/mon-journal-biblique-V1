import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ imagePreview, onImageChange }: ImageUploadProps) {
  return (
    <FormItem>
      <FormLabel>Image à la une</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-w-md h-48 object-cover rounded-md"
            />
          )}
        </div>
      </FormControl>
    </FormItem>
  );
}