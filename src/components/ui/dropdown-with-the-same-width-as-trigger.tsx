
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface Document {
  id: number;
  title: string;
}

interface DropdownProps {
  docs: Document[];
}
function Dropdown({ docs }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        // ... existing trigger code ...
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
        {docs.map((doc) => (
          <DropdownMenuItem key={doc.id}>
            {doc.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Dropdown };
