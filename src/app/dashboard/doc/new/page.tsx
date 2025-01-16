"use client"

import { Dropdown , BlockType} from "@/components/ui/dropdown-with-the-same-width-as-trigger";
import { useState , useEffect } from "react";
import { blockTypes, headingBlock, textFormatBlock, imageBlock, linkBlock, listBlock, quoteBlock, codeBlock, linebreakBlock , tableBlock } from "../blocks";
export default function NewDocPage() {

    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    
    const handleFormatChange = (format: string) => {
        setSelectedFormat(format);
        console.log(format);
    };

    

    
    return (
      <div className="grid grid-cols-12 min-h-screen">
        {/* Sidebar - 20% */}
        <div className="col-span-3 bg-gray-100 p-4 border-r">
          
          <div className="flex flex-col gap-6 pt-6 text-center justify-center items-center">
            {blockTypes.map((block) => (
              <Dropdown key={block.id} block={block} onSelect={handleFormatChange} />
            ))}
          </div>
        </div>

        <div className="col-span-4 p-4 text-center justify-center items-center">
          <h2 className="text-lg font-semibold mb-4">{selectedFormat}</h2>
          
          <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
            <textarea
              className="w-full h-96 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C9A92] resize-none"
              placeholder="Markdown text here..."
            />
            <button 
              className="mt-4 bg-[#7C9A92] text-white px-4 py-2 rounded-md hover:bg-[#6B8A82] transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Block
            </button>
          </div>
        </div>

        {/* Right section - 50% */}
        <div className="col-span-5 p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-center justify-center items-center">Document Preview</h2>
          {/* Add right section content here */}
        </div>
      </div>
    );
}
  