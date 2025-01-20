"use client"

import { Suspense } from "react";
import { Dropdown } from "@/components/ui/dropdown-with-the-same-width-as-trigger";
import { useState , useEffect } from "react";
import { blockTypes } from "../blocks";
import { useSearchParams } from 'next/navigation';
import { TextBlock } from "@/types"; // Import the consolidated type
import DocPreview from "@/components/ui/docpreview";
import Modal from "@/components/ui/modal";
import { markdownFunctions } from "@/app/utils/markdown";
import { Dots_v2 } from "@/components/ui/spinner";


function NewDoc() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>("Untitled Document");
  const [blockText, setBlockText] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TextBlock[]>([]);
  const [editBlock, setEditBlock] = useState<TextBlock | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateBlocks = (updatedBlocks: TextBlock[]) => {
    console.log("Updated blocks received from DocPreview:", updatedBlocks);
    setBlocks(updatedBlocks); // Update the parent state
  };

  const handleFormatChange = (format: string) => {
      setSelectedFormat(format);
      console.log(format);
  };

  
  const handleDownload = () => {
    if (!modalContent) {
      return;
    }

    // Create a Blob from the Markdown content
    const blob = new Blob([modalContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> tag to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentName || "Untitled_Document"}.md`; // File name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleModalContent(blocks);
  }, [blocks]);

  const handleModalContent = (content: TextBlock[]) => {
    const textblocks = content.map(block => {
      // Apply the corresponding markdown function based on the block type
      switch (block.type) {
        case 'Heading 1':
          return markdownFunctions.h1(block.text);
        case 'Heading 2':
          return markdownFunctions.h2(block.text);
        case 'Heading 3':
          return markdownFunctions.h3(block.text);
        case 'Heading 4':
          return markdownFunctions.h4(block.text);
        case 'Heading 5':
          return markdownFunctions.h5(block.text);
        case 'Heading 6':
          return markdownFunctions.h6(block.text);
        case 'Italic':
          return markdownFunctions.italic(block.text);
        case 'Bold':
          return markdownFunctions.bold(block.text);
        case 'Bold & Italic':
          return markdownFunctions.boldItalic(block.text);
        case 'Strikethrough':
          return markdownFunctions.strikethrough(block.text);
        case 'Inline Code':
          return markdownFunctions.inlineCode(block.text);
        case 'Code Block':
          return markdownFunctions.codeBlock(block.text);
        case 'Link':
          return markdownFunctions.link(block.text);
        case 'Image':
          return markdownFunctions.image(block.text);
        case 'Bullet List':
          return markdownFunctions.bulletList(block.text);
        case 'Numbered List':
          return markdownFunctions.numberedList(block.text);
        case 'Line Break':
          return markdownFunctions.lineBreak();
        case 'Table':
          return markdownFunctions.table(block.text);
        case 'Quote':
          return markdownFunctions.blockquote(block.text);
        default:
          return block.text; // Fallback to plain text
      }
    }).join('\n');


    setModalContent(textblocks);
    console.log("modal content is: ", textblocks);
    console.log("modal content is of type: ", typeof textblocks);
  };

  const handleDoneBlocks = async () => {
    try {
      console.log("blocks being sent to the server are: ", blocks);
      await Promise.all(blocks.map(async (block) => {
        const response = await fetch("/api/dashboard", {
          method: "POST",
          body: JSON.stringify({ 
              action: "updateDoneBlock", 
              documentId: docId, 
              block: block
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Failed to update block ${block.id}:`, response.statusText);
        }
        else {
          console.log("block updated successfully");
          const result = await response.json();
          console.log("result is: ", result);
        }
      }));
    } catch (error) {
      console.error("Error updating all blocks:", error);
    }
  }

  const handleDone = async () => {
      try {
          await handleDoneBlocks();

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

  const handleOrderChange = (updatedBlocks: TextBlock[]) => {
    updatedBlocks.forEach((block) => {
      block.order = updatedBlocks.indexOf(block);
    });
  };

  const handleAddBlock = async () => {
      // Check for errors
      if (!selectedFormat) {
          console.error("Choose a format");
          return; // Exit the function if no format is selected
      }
      if (!blockText) {
          console.error("Must type something");
          return; // Exit the function if the text box is empty
      }

      const response = await fetch("/api/dashboard", {
          method: "POST",
          body: JSON.stringify({ 
              action: "createBlock", 
              documentId: docId, 
              text: blockText,
              type: selectedFormat
          }),
      });

      if(response.ok){
        // get the new block
        const result = await response.json();
        const newBlock = result.data[0];
        console.log("result is: ", result);
        console.log("new block is: ", newBlock);
        // add it to the blocks array by lifting the state
        setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      }
      setBlockText("");
  };

  const handleGenerate = async () => {
    let action = "";
    if(selectedFormat === "Text" || selectedFormat === "Heading 1" || selectedFormat === "Heading 2" || selectedFormat === "Heading 3" || selectedFormat === "Heading 4" || selectedFormat === "Heading 5" || selectedFormat === "Heading 6" || selectedFormat === "Italic" || selectedFormat === "Bold" || selectedFormat === "Bold & Italic" || selectedFormat === "Strikethrough" || selectedFormat === "Inline Code" || selectedFormat === "Code Block" || selectedFormat === "Quote"){
      action = "summarize";
    }
    else if(selectedFormat === "Table"){
      action = "tableify";
    }
    else{
      return;
    }
    try {
        const response = await fetch("/api/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, prompt: blockText }),
        });
  
        if (!response.ok) {
            throw new Error("Failed to generate text");
        }
  
        const data = await response.json();
        console.log("Generated Text:", data);
        console.log("data is: ", data.data.content);
        setBlockText(data.data.content);
    } catch (error) {
        console.error("Error:", error);
    }
  
  };

  const handleDocumentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDocumentName(event.target.value);
      setModalTitle(event.target.value);

      console.log("modal title is: ", modalTitle);
      console.log("document name is: ", documentName);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setBlockText(event.target.value);
  };

  useEffect(() => {
    console.log("Edit block has been updated:", editBlock);
  }, [editBlock]);
  
  useEffect(() => {
    handleOrderChange(blocks);
    console.log("blocks are: ", blocks);

  }, [blocks]);

  const handleEditBlock = (updatedBlock: TextBlock) => {
    setEditBlock(updatedBlock); // Directly set the editBlock to the updatedBlock
    setBlockText(updatedBlock.text);
    setSelectedFormat(updatedBlock.type);
    console.log("Updated textBlock:", updatedBlock);
  };

  const handleDeleteBlock = (deletedBlock: TextBlock) => {
    console.log("Deleted block is: ", deletedBlock);
    if (deletedBlock.id === editBlock?.id) {
      console.log("Deleted block is the same as the edit block");
      console.log("Deleted block is: ", deletedBlock);
      console.log("Edit block is: ", editBlock);
      setEditBlock(null);
      setBlockText("");
    }
    else {
      console.log("Deleted block is not the same as the edit block");
      console.log("Deleted block is: ", deletedBlock);
      console.log("Edit block is: ", editBlock);
    }
    setBlocks(blocks.filter(block => block.id !== deletedBlock.id));
    console.log("blocks after deletion are: ", blocks);

  };

  const updateDocument = async (docname: string) => {
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({ 
          action: "updateDocument", 
          documentId: docId, 
          title: docname 
        }),
      });
    }
    catch (error) {
      console.error("Error updating document:", error);
    }
  }



  const handleUpdateBlock = async () => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          action: "updateBlock",
          textBlockId: editBlock?.id,
          documentId: docId,
          text: blockText,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Block updated:", result);
  
        // Update the blocks state
        setBlocks((prevBlocks: TextBlock[]) =>
          prevBlocks.map((block: TextBlock) =>
            block.id === editBlock?.id ? { ...block, text: blockText || '' } : block
          )
        );
  
        // Reset edit state
        setEditBlock(null);
        setBlockText("");

      } else {
        console.error("Failed to update block:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };
  

  useEffect(() => {
      docinfo();
  }, []);

  const docinfo = async () => {
    const response = await fetch("/api/dashboard?action=getBlocks&documentId=" + docId, {
        method: "GET",
    });
    const result = await response.json();
    console.log("result is: ", result);
    if (result.data.length === 0) {
      updateDocument("Untitled Document");
      setDocumentName("Untitled Document");
      setModalTitle("Untitled Document");
    }
    else {
      setModalTitle(result.data[0].docs.title);
      setDocumentName(result.data[0].docs.title);
    }
    console.log("from the db: ");
    type ApiResponse = typeof result.data;
    const blockdata = result.data.map((block: ApiResponse) => block.text_blocks);
    console.log("db is: ", blockdata);
    const orderedBlocks = blockdata.sort((a : TextBlock, b : TextBlock) => a.order - b.order);
    console.log("ordered blocks are: ", orderedBlocks);
    setBlocks(orderedBlocks);
}

  

  return (
      <div className="grid grid-cols-12 min-h-screen">
        {/* Sidebar - 20% */}
        <div className="col-span-3 bg-creamWhite/80 p-4 border-r">
          
          <div className="flex flex-col gap-6 pt-6 text-center justify-center items-center">
            {blockTypes.map((block) => (
              <Dropdown key={block.id} block={block} onSelect={handleFormatChange} />
            ))}
          </div>
          <button onClick={openModal} className="mt-8 bg-mutedCharcoal opacity-100 text-white px-4 py-2 rounded-md hover:bg-mutedCharcoal/90 transition-colors duration-200 flex items-center gap-2 mx-auto">
            Get Preview
          </button>
          <button
            onClick={handleDownload}
            className="mt-8 bg-mutedCharcoal text-white px-4 py-2 rounded-md hover:bg-mutedCharcoal/90 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            Download Markdown
          </button>
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
                <div className="flex justify-between items-center mt-4">
        {/* AI Button */}
        <button
      className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
      onClick={() => handleGenerate()}
    >
      AI
    </button>


      {/* Add/Edit Block Button */}
      <button 
        className={`${
          editBlock ? 'bg-mutedCharcoal' : 'bg-mutedCharcoal'
        } text-white px-4 py-2 rounded-md hover:bg-mutedCharcoal/90 transition-colors duration-200 flex items-center gap-2`}
        onClick={editBlock ? () => handleUpdateBlock() : handleAddBlock}
        disabled={!editBlock && !blockText}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        {editBlock ? 'Edit' : 'Add Block'}
      </button>
    </div>
  </div>
          <button 
            className="mt-8 bg-mutedCharcoal text-white px-4 py-2 rounded-md hover:bg-mutedCharcoal/90 transition-colors duration-200 flex items-center gap-2 mx-auto"
            onClick={handleDone}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Done
          </button>
        </div>

        {/* Right section - 50% */}
        <div className="col-span-5 p-4 bg-creamWhite/20">
          <input
            type="text"
            value={documentName || ''}
            onChange={handleDocumentNameChange}
            className="text-lg font-semibold text-center w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#7C9A92] focus:outline-none px-2 py-1"
            placeholder="Untitled Document"
          />
          {/* Add right section content here */}
          
          
          <DocPreview blocks={blocks || []} onUpdate={handleUpdateBlocks} onEdit={handleEditBlock} onDelete={handleDeleteBlock} />
          <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} content={modalContent} />
        </div>
      </div>
  );
}

export default function NewDocPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Dots_v2/></div>}>
      <NewDoc />
    </Suspense>
  );
}
