import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextBlock } from "@/types";

interface SortableItemProps {
  id: number;
  block: TextBlock;
  onEdit?: (block: TextBlock) => void;
  onDelete?: (block: TextBlock) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, block, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 bg-white border rounded shadow-sm hover:shadow-md"
    >
      <div>
        <p className="text-lg font-semibold">{block.text}</p>
        <small className="text-gray-500">{block.type}</small>
      </div>
      <div className="flex gap-2">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onEdit && onEdit(block)}
        >
          Edit
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => {
            onDelete && onDelete(block);
            console.log("Delete button clicked for ID:", block.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SortableItem;
