import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from './button';

interface TextblockProps {
  id: number;
  text: string;
  type: string;
}

export const Textblock: React.FC<TextblockProps> = ({ id, text, type }) => {
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
      <h3 className='text-lg font-semibold text-gray-800 justify-normal w-full'>{type}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/50"
      >
        x
      </Button>
      </h3>
      <p className='text-gray-700'>{text}</p>
    </div>
  );
};

export default Textblock;