import React from 'react';
import ReactMarkdown from 'react-markdown';
import MarkdownPreview from './markdownpreview';
import remarkGfm from 'node_modules/remark-gfm/lib';

interface LargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string; // Accept Markdown as a string
}

const Modal: React.FC<LargeModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  console.log("modal content in modal is: ", content);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full h-3/4 overflow-y-auto scrollable-content relative">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl text-center font-semibold flex-grow">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="prose max-w-none p-4 w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div> 
      </div>
    </div>
  );
};

export default Modal;
