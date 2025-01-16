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

// Example usage:
const textFormatBlock: BlockType = {
  id: "text-format",
  title: "Text Format",
  options: [
    { id: "bold", title: "Bold", format: "**text**" },
    { id: "italic", title: "Italic", format: "*text*" },
    { id: "bold-italic", title: "Bold & Italic", format: "***text***" },
    { id: "strikethrough", title: "Strikethrough", format: "~~text~~" },
  ]
};

export { Dropdown, type BlockType };
