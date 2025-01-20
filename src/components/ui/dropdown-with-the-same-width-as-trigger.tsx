import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FormatOption {
  id: string;
  title: string;
  format: string;
}

interface BlockType {
  id: string;
  title: string;
  options: FormatOption[];
}

interface DropdownBlocksProps {
  block: BlockType;
  onSelect: (format: string) => void;
}

function Dropdown({ block, onSelect }: DropdownBlocksProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-lg font-medium no-underline outline-none hover:text-primary transition-colors">
          {block.title}
          <ChevronDown className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
        {block.options.map((option) => (
          <DropdownMenuItem 
            key={option.id}
            onClick={() => onSelect(option.title)}
            className="text-base font-medium data-[state=selected]:bg-transparent"
          >
            {option.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Dropdown, type BlockType };
