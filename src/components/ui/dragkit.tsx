'use client';

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "./button";
import SortableItem from "./SortableItem";
import { TextBlock } from "@/types";

interface DragAndDropProps {
  textBlocks: TextBlock[];
  onReorder?: (reorderedBlocks: TextBlock[]) => void;
  onEdit?: (editedBlock: TextBlock) => void;
  onDelete?: (block: TextBlock) => void;
}

export default function DragAndDrop({
  textBlocks = [],
  onReorder,
  onEdit,
  onDelete,
}: DragAndDropProps) {
  const [blocks, setBlocks] = useState<TextBlock[]>(
    textBlocks.sort((a, b) => a.order - b.order)
  );

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setBlocks(textBlocks);
  }, [textBlocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBlocks((prevBlocks) => {
      const oldIndex = prevBlocks.findIndex((block) => block.id === active.id);
      const newIndex = prevBlocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(prevBlocks, oldIndex, newIndex);

      // Notify parent about the reordering
      if (onReorder) onReorder(reorderedBlocks);

      return reorderedBlocks;
    });
  };

  const handleEditBlock = (block: TextBlock) => {
    if (onEdit) onEdit(block);
  };

  const handleDeleteBlock = (block: TextBlock) => {
    console.log("Deleting block with id:", block.id);
    if (onDelete) onDelete(block);
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== block.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((block) => block.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          {blocks.map((block) => (
            <SortableItem
              key={block.id}
              id={block.id}
              block={block}
              onEdit={handleEditBlock}
              onDelete={handleDeleteBlock}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
