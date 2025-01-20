import { BlockType} from "@/components/ui/dropdown-with-the-same-width-as-trigger";

const headingBlock: BlockType = {
    id: "heading",
    title: "Heading",
    options: [
        { id: "h1", title: "Heading 1", format: "h1" },
        { id: "h2", title: "Heading 2", format: "h2" },
        { id: "h3", title: "Heading 3", format: "h3" },
        { id: "h4", title: "Heading 4", format: "h4" },
        { id: "h5", title: "Heading 5", format: "h5" },
        { id: "h6", title: "Heading 6", format: "h6" }
    ]
};

const textFormatBlock: BlockType = {
    id: "text-format",
    title: "Text Format",
    options: [
        { id: "text", title: "Text", format: "text" },
        { id: "bold", title: "Bold", format: "**text**" },
        { id: "italic", title: "Italic", format: "*text*" },
        { id: "bold-italic", title: "Bold & Italic", format: "***text***" },
        { id: "strikethrough", title: "Strikethrough", format: "~~text~~" }
    ]
};

const imageBlock: BlockType = {
    id: "image",
    title: "Image",
    options: [
        { id: "image", title: "Image", format: "![alt text](image.jpg)" },
    ]
};

const linkBlock: BlockType = {
    id: "link",
    title: "Link",
    options: [
        { id: "link", title: "Link", format: "[alt text](link.com)" },
    ]
};

const listBlock: BlockType = {
    id: "list",
    title: "List",
    options: [
        { id: "numbered-list", title: "Numbered List", format: "1. item\n2. item\n3. item" },
        { id: "bullet-list", title: "Bullet List", format: "- item\n- item\n- item" }
    ]
};

const quoteBlock: BlockType = {
    id: "quote",
    title: "Quote",
    options: [
        { id: "quote", title: "Quote", format: "> text" },
    ]
};  

const codeBlock: BlockType = {
    id: "code",
    title: "Code",
    options: [
        { id: "code", title: "Code Block", format: "```code```" },
        { id: "inline-code", title: "Inline Code", format: "`code`" }
    ]
};

const linebreakBlock: BlockType = { 
    id: "linebreak",
    title: "Linebreak",
    options: [
        { id: "linebreak", title: "Linebreak", format: "linebreak" },
    ]
};

const tableBlock: BlockType = { 
    id: "table",
    title: "Table",
    options: [
        { id: "table", title: "Table", format: "| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Row 1 | Row 1 | Row 1 |\n| Row 2 | Row 2 | Row 2 |" },
    ]
};

const blockTypes = [headingBlock , textFormatBlock , imageBlock , linkBlock , listBlock , quoteBlock , codeBlock , linebreakBlock , tableBlock];

export { blockTypes , headingBlock , textFormatBlock , imageBlock , linkBlock , listBlock , quoteBlock , codeBlock , linebreakBlock , tableBlock };