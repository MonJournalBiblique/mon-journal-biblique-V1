import { Shield } from "lucide-react";

interface AdminBadgeProps {
  isAdmin: boolean;
}

export const AdminBadge = ({ isAdmin }: AdminBadgeProps) => {
  if (!isAdmin) return null;
  
  return (
    <span className="ml-2 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
      Admin
    </span>
  );
};