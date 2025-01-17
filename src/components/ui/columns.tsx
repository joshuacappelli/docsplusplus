import React from 'react';
import { TextBlock } from '@/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Textblock } from './textblock';

export const columns = (blocks: TextBlock[]) => {
  return (
    <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center text-center justify-center bg-white p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Textblock {...block} />
          </div>
        ))}
      </div>
    </SortableContext>
  );
};