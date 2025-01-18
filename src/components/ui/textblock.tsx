import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from './button';

interface TextblockProps {
  id: number;
  text: string;
  type: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const Textblock: React.FC<TextblockProps> = ({ id, text, type, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transition, transform } = useSortable({ id });

  const style = {
    transition,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      className="flex flex-col bg-slate-400 p-4 m-2 rounded-lg shadow-md w-full transition-colors duration-200 hover:bg-slate-500"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="flex justify-between items-center w-full" onClick={() => onEdit(id)}>
        <h3 className="flex-1 text-lg font-semibold text-gray-800 hover:text-blue-500 cursor-pointer break-words">
          {type}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/50 ml-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the onEdit from firing
            onDelete(id);
            console.log('Deleting block with id:', id);
          }}
        >
          x
        </Button>
      </div>
      {/* Added classes for text wrapping */}
      <p className="text-gray-700 break-words">
        {text}
      </p>
    </div>
  );
};

export default Textblock;
