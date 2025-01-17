'use client';

import React, { useState, useEffect } from "react";

interface TextBlock {
  id: number;
  text: string;
  type: string;
  order: number;
  docId: number;
  createdAt: string;
  updatedAt: string | null;
}

interface DragAndDropProps {
  textBlocks: TextBlock[];
  onReorder?: (reorderedBlocks: TextBlock[]) => void;
}

const testdata = [
  { id: 1, text: "Hello", type: "text" },
  { id: 2, text: "World", type: "text" },
  { id: 3, text: "Hello", type: "text" },
  { id: 4, text: "World", type: "text" },
]

export default function DragAndDrop({ textBlocks = [] }: DragAndDropProps) {
  const [blocks, setBlocks] = useState(textBlocks.sort((a, b) => a.order - b.order));

  useEffect(() => {
    setBlocks(textBlocks);
  }, [textBlocks]);



  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);
    setBlocks(newBlocks);
    
    // Update the order of all blocks
    newBlocks.forEach((block, index) => {
      block.order = index; // Assuming you have an 'order' property to track the order
    });

    // Log the new order of blocks
    console.log("New order of blocks:", newBlocks);

    // Call the reorder API for each block in newBlocks
    await Promise.all(newBlocks.map(async (block, index) => {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({ 
            action: "reorderBlock", 
            documentId: block.docId, 
            textBlockId: block.id,
            newOrder: index
        }),
      });

      // Log the response from the server
      const responseData = await response.json();
      console.log("Response from server for block", block.id, ":", responseData);
    }));
  };

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="p-4 bg-white rounded shadow cursor-move hover:shadow-md transition-shadow"
        >
          <p>{block.text}</p>
          <small className="text-gray-500">{block.type}</small>
        </div>
      ))}
    </div>
  );
}
