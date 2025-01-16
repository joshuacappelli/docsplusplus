'use client';

import React, { useState } from "react";

interface TextBlock {
  id: number;
  text: string;
  type: string;
  docId: number;
  createdAt: string;
  updatedAt: string;
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
  const [blocks, setBlocks] = useState(testdata);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);
    setBlocks(newBlocks);
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
