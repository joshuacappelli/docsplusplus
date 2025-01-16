"use client"

import { Dropdown , BlockType} from "@/components/ui/dropdown-with-the-same-width-as-trigger";
import { useState , useEffect, use } from "react";
import { blockTypes, headingBlock, textFormatBlock, imageBlock, linkBlock, listBlock, quoteBlock, codeBlock, linebreakBlock , tableBlock } from "../blocks";
import { useSearchParams } from 'next/navigation';


export default function NewDocPage() {
    const searchParams = useSearchParams();
    const docId = searchParams.get('docId');
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [documentName, setDocumentName] = useState<string | null>("Untitled Document");
    const [blockText, setBlockText] = useState<string | null>(null);
    


    const handleFormatChange = (format: string) => {
        setSelectedFormat(format);
        console.log(format);
    };

    const handleDone = async () => {
        try {
            const response = await fetch("/api/dashboard", {
                method: "POST",
                body: JSON.stringify({ 
                    action: "updateDocument", 
                    documentId: docId, 
                    title: documentName 
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                console.error("Failed to update document:", response.statusText);
                return;
            }
    
            // Handle the response if necessary
            const result = await response.json();
    
            if (result.success) {
                // Redirect to the dashboard
                window.location.href = "/dashboard";
            } else {
                console.error("Update failed:", result.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };
    

    const handleAddBlock = async () => {
        const response = await fetch("/api/dashboard", {
            method: "POST",
            body: JSON.stringify({ 
                action: "createBlock", 
                documentId: docId, 
                text: blockText,
                type: selectedFormat
            }),
        });
        setBlockText("");
        await docinfo();
    };

    const handleDocumentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentName(event.target.value);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBlockText(event.target.value);
    };

    useEffect(() => {
        docinfo();
    }, []);

    const docinfo = async () => {
        const response = await fetch("/api/dashboard?action=getBlocks&documentId=" + docId, {
            method: "GET",
        });
        const result = await response.json();
        console.log(result.data);
    }

    
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
              value={blockText || ''}   
              onChange={handleTextChange}
              className="w-full h-96 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C9A92] resize-none"
              placeholder="Markdown text here..."
            />
            <button 
              className="mt-4 bg-[#7C9A92] text-white px-4 py-2 rounded-md hover:bg-[#6B8A82] transition-colors duration-200 flex items-center gap-2 mx-auto"
              onClick={handleAddBlock}
              disabled={selectedFormat == null}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Block
            </button>
          </div>
          <button 
            className="mt-8 bg-[#7C9A92] text-white px-4 py-2 rounded-md hover:bg-[#6B8A82] transition-colors duration-200 flex items-center gap-2 mx-auto"
            onClick={handleDone}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Done
          </button>
        </div>

        {/* Right section - 50% */}
        <div className="col-span-5 p-4 bg-gray-50">
          <input
            type="text"
            value={documentName || ''}
            onChange={handleDocumentNameChange}
            className="text-lg font-semibold text-center w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#7C9A92] focus:outline-none px-2 py-1"
            placeholder="Untitled Document"
          />
          {/* Add right section content here */}
        </div>
      </div>
    );
}
  