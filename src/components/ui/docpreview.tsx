'use client';
import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TextBlock } from "@/types";
import { columns } from "./columns";


interface DocPreviewProps {
    blocks: TextBlock[];
    onUpdate: (updatedBlocks: TextBlock[]) => void; // Callback prop
    onEdit: (editedBlock: TextBlock) => void;
    onDelete: (deletedBlock: TextBlock) => void;
  }
  
  export default function DocPreview({ blocks, onUpdate, onEdit, onDelete }: DocPreviewProps) {
    const [textblocks, setBlocks] = useState<TextBlock[]>(blocks);
    const [editedBlock, setEditedBlock] = useState<TextBlock | null>(null);
  
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
          if (block) {
            onDelete(block);
          }
        } catch (error) {
          console.error('Error deleting block:', error);
        } finally {
            console.log("Block deleted");
        }
      };

      useEffect(() => {
        console.log("textblocks are after deletion: ", textblocks);
      }, [handleDelete]);
        

      const handleEdit = (id: number) => {
        const block = textblocks.find(b => b.id === id);
        if (block) {
            setEditedBlock(block);
            onEdit(block);
        }
      };

      useEffect(() => {
        console.log("edited block is: ", editedBlock);
      }, [editedBlock]);

    useEffect(() => {
      console.log("textblocks state updated:", textblocks);
    }, [textblocks]);

  
    return (
      <div>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCorners}>
          {columns(textblocks, handleDelete, handleEdit)}
        </DndContext>
      </div>
    );
  }
  
  

  