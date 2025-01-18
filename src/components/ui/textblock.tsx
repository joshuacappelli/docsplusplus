import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from './button';

interface TextblockProps {
  id: number;
  text: string;
  type: string;
  onDelete: (id: number) => void;
}

export const Textblock: React.FC<TextblockProps> = ({ id, text, type, onDelete }) => {
  const { attributes, listeners, setNodeRef, transition, transform } = useSortable({ id });

  const style = {
    transition,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, // Use transform directly
  };

  return (
    <div 
      className='flex flex-col bg-slate-400 p-4 m-2 rounded-lg shadow-md w-full'
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
      style={style}
    >
      <div className='flex justify-between w-full'>
        <div className='flex-1 flex justify-end'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {type}
          </h3>
        </div>
        <div className='flex-1 flex justify-end'>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/50"
            onClick={() => {
              onDelete(id);
              console.log("Deleting block with id:", id);
            }}
          >
            x
          </Button>
        </div>
      </div>
      <p className='text-gray-700'>{text}</p>
    </div>
  );
};

export default Textblock;