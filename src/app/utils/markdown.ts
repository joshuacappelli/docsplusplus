export function h1(text: string): string {
    return `# ${text}`;
}

export function h2(text: string): string {
    return `## ${text}`;
}

export function h3(text: string): string {
    return `### ${text}`;
}

export function h4(text: string): string {
    return `#### ${text}`;
}

export function h5(text: string): string {
    return `##### ${text}`;
}

export function h6(text: string): string {
    return `###### ${text}`;
}

export function bold(text: string): string {
    return `**${text}**`;
}

export function italic(text: string): string {
    return `*${text}*`;
}

export function boldItalic(text: string): string {
    return `***${text}***`;
}

export function strikethrough(text: string): string {
    return `~~${text}~~`;
}

export function inlineCode(text: string): string {
    return `\`${text}\``;
}

export function codeBlock(text: string): string {
    return `\`\`\`\n${text}\n\`\`\``;
}

export function link(textWithUrl : string): string {
    const [text, url] = textWithUrl.split(' ');
    return `[${text}](${url})`;
}

export function image(textWithUrl: string): string {
    const [text, url] = textWithUrl.split(' ');
    return `![${text}](${url})`;
}

export function bulletList(items: string): string {
    return items.split('\n').map(item => `- ${item}`).join('\n');
}

export function numberedList(items: string): string {
    return items.split('\n').map((item, index) => `${index + 1}. ${item}`).join('\n');
}

export function lineBreak(): string {
    return `\n`;
}

export function table(text: string): string {
    return `| ${text.split('|').join('|')} |\n| ${text.split('|').join('|\n|')} |`;
}

export function blockquote(text: string): string {
    return `> ${text}`;
}

export const markdownFunctions = {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    italic,
    boldItalic,
    strikethrough,
    inlineCode,
    codeBlock,
    link,
    image,
    bulletList,
    numberedList,
    lineBreak,
    table,
    blockquote,
};
