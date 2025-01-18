'use client';
import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TextBlock } from "@/types";
import { columns } from "./columns";

const testTextBlocks: TextBlock[] = [
  {
    id: 1,
    text: "Introduction to React",
    type: "header",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
    order: 1,
    docId: 1,
  },
  {
    id: 2,
    text: "React is a JavaScript library for building user interfaces.",
    type: "paragraph",
    createdAt: "2025-01-02T11:30:00Z",
    updatedAt: "2025-01-02T12:00:00Z",
    order: 2,
    docId: 1,
  },
  {
    id: 3,
    text: "Getting Started",
    type: "header",
    createdAt: "2025-01-03T14:15:00Z",
    updatedAt: "2025-01-03T14:15:00Z",
    order: 3,
    docId: 1,
  },
  {
    id: 4,
    text: "To use React, you'll need to set up a development environment.",
    type: "paragraph",
    createdAt: "2025-01-04T09:45:00Z",
    updatedAt: "2025-01-04T10:00:00Z",
    order: 4,
    docId: 1,
  },
  {
    id: 5,
    text: "Learn More",
    type: "link",
    createdAt: "2025-01-05T08:00:00Z",
    updatedAt: "2025-01-05T08:30:00Z",
    order: 5,
    docId: 1,
  },
];

interface DocPreviewProps {
    blocks: TextBlock[];
    onUpdate: (updatedBlocks: TextBlock[]) => void; // Callback prop
  }
  
  export default function DocPreview({ blocks, onUpdate }: DocPreviewProps) {
    const [textblocks, setBlocks] = useState<TextBlock[]>(blocks);
  
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          delay: 100,
          tolerance: 5,
        },
      })
    );
  
    useEffect(() => {
      setBlocks(blocks);
    }, [blocks]);
  
    const getBlockPos = (id: number) => textblocks.findIndex((block) => block.id === id);
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (active.id === over?.id) return;
  
      const updatedBlocks = arrayMove(
        textblocks,
        getBlockPos(Number(active.id)),
        getBlockPos(Number(over?.id))
      );
  
      setBlocks(updatedBlocks);
      onUpdate(updatedBlocks); // Notify the parent of the updated state
    };
  
    const handleDelete = async (id: number) => {
        try {
            const block = textblocks.find(b => b.id === id);
            if (block) {
                await fetch(`/api/dashboard?action=deleteBlock&documentId=${block.docId}&textBlockId=${block.id}`, {
                    method: 'DELETE',
                });
            }
    
          setBlocks(blocks.filter(b => b.id !== id));
        } catch (error) {
          console.error('Error deleting block:', error);
        } finally {
            console.log("Block deleted");
        }
      };
  
    useEffect(() => {
      console.log("textblocks state updated:", textblocks);
    }, [textblocks]);
  
    return (
      <div>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCorners}>
          {columns(textblocks, handleDelete)}
        </DndContext>
      </div>
    );
  }
  
  

  