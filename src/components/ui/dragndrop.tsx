'use client';

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { TextBlock } from "@/types";

interface DragAndDropProps {
  textBlocks: TextBlock[];
  onReorder?: (reorderedBlocks: TextBlock[]) => void;
  onEdit?: (editedBlock: TextBlock) => void;
}

const testdata = [
  { id: 1, text: "Hello", type: "text" },
  { id: 2, text: "World", type: "text" },
  { id: 3, text: "Hello", type: "text" },
  { id: 4, text: "World", type: "text" },
]

export default function DragAndDrop({ textBlocks = [], onEdit }: DragAndDropProps) {
  const [blocks, setBlocks] = useState(textBlocks.sort((a, b) => a.order - b.order));
  const [isLoading, setIsLoading] = useState(true);

  const [editBlock, setEditBlock] = useState<TextBlock | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  useEffect(() => {
    setBlocks(textBlocks);
  }, [textBlocks]);

  const handleDeleteBlock = async (block: TextBlock) => {
    try {
      setIsLoading(true);
      await fetch(`/api/dashboard?action=deleteBlock&documentId=${block.docId}&textBlockId=${block.id}`, {
        method: 'DELETE',
      });

      setBlocks(blocks.filter(b => b.id !== block.id));
      router.refresh();
    } catch (error) {
      console.error('Error deleting block:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlock = (block: TextBlock) => {
    const editedBlock = {
      ...block,
      text: block.text, // Replace with actual user input
    };

    console.log("Editing block", editedBlock);
    setEditBlock(editedBlock);
    setIsEditing(true);

    // Call the onEdit prop to notify the parent
    if (onEdit) {
      onEdit(editedBlock);
    }
  };

  useEffect(() => {
    setBlocks(blocks);
  }, [blocks]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    console.log("Dragging block", index);
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
    // newBlocks.forEach((block, index) => {
    //   block.order = index; // Assuming you have an 'order' property to track the order
    // });

    // // Log the new order of blocks
    // console.log("New order of blocks:", newBlocks);

    // // Call the reorder API for each block in newBlocks
    // await Promise.all(newBlocks.map(async (block, index) => {
    //   const response = await fetch("/api/dashboard", {
    //     method: "POST",
    //     body: JSON.stringify({ 
    //         action: "reorderBlock", 
    //         documentId: block.docId, 
    //         textBlockId: block.id,
    //         newOrder: index
    //     }),
    //   });

    //   // Log the response from the server
    //   const responseData = await response.json();
    //   console.log("Response from server for block", block.id, ":", responseData);
    // }));
  };

  return (
    <div className="h-full">
  {blocks.map((block, index) => (
    <div
      key={block.id}
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onClick={() => handleEditBlock(block)}
      onDrop={(e) => handleDrop(e, index)}
      className="flex items-center justify-between p-4 bg-white rounded shadow cursor-move hover:shadow-md transition-shadow text-center m-4"
    >
      <div className="flex flex-col items-center w-full whitespace-nowrap overflow-hidden">
        <small className="text-gray-500">{block.type}</small>
        <p className=" text-center h-auto">{block.text}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/50"
        onClick={() => handleDeleteBlock(block)}
      >
        x
      </Button>
    </div>
  ))}
</div>

  );
}
