import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Rechercher un post..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};