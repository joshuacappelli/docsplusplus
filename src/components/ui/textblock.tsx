import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

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
      className='flex flex-col bg-slate-400 p-4 m-2 rounded-lg shadow-md'
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
      style={style}
    >
      <h3 className='text-lg font-semibold text-gray-800'>{type}</h3>
      <p className='text-gray-700'>{text}</p>
    </div>
  );
};

export default Textblock;