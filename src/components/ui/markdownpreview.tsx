import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownPreview = () => {
  const markdown = `
# Heading 1
This is a paragraph.

- List item 1
- List item 2

\`\`\`javascript
console.log("Hello, world!");
\`\`\`
`;
    console.log("markdown is: ", markdown);
    console.log("markdown is of type: ", typeof markdown);
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
