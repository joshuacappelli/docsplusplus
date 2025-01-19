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
    const endMarker = "END"; // Define an end marker
    const trimmedText = text.trim();

    // Automatically add the end marker if it's not present
    if (!trimmedText.endsWith(endMarker)) {
        text = `${trimmedText}\n${endMarker}`; // Append the end marker
    }

    const rows = text.split('\n'); // Split into rows
    const header = rows[0]
      .split('|')
      .map((cell) => cell.trim())
      .join(' | '); // Format header row
    const divider = rows[0]
      .split('|')
      .map(() => '---')
      .join(' | '); // Create the divider row
    const body = rows
      .slice(1, -1) // Exclude the header row and the end marker
      .map((row) =>
        row
          .split('|')
          .map((cell) => cell.trim())
          .join(' | ')
      )
      .join('\n'); // Join all body rows with newlines
  
    return `| ${header} |\n| ${divider} |\n${body ? `| ${body.replace(/\n/g, ' |\n|')} |` : ''}`;
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
    bold,
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
