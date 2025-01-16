'use client';

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function DragAndDrop() {
  const [stores, setStores] = useState([
    {
      id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
      name: "Walmart",
      items: [
        { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
        { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
      ],
      tint: 1,
    },
    {
      id: "487f68b4-1746-438c-920e-d67b7df46247",
      name: "Indigo",
      items: [
        { id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae", name: "Designing Data Intensive Applications" },
        { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
      ],
      tint: 2,
    },
    {
      id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
      name: "Lowes",
      items: [
        { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
        { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
      ],
      tint: 3,
    },
  ]);

  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;

    // If dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // If dragging store groups
    if (type === "group") {
      const reorderedStores = Array.from(stores);
      const [removed] = reorderedStores.splice(source.index, 1);
      reorderedStores.splice(destination.index, 0, removed);
      setStores(reorderedStores);
      return;
    }

    // If dragging items
    const sourceStore = stores.find(store => store.id === source.droppableId);
    const destStore = stores.find(store => store.id === destination.droppableId);

    if (!sourceStore || !destStore) return;

    // If moving within the same store
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceStore.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newStores = stores.map(store => 
        store.id === sourceStore.id ? { ...store, items: newItems } : store
      );
      
      setStores(newStores);
    } else {
      // If moving to a different store
      const sourceItems = Array.from(sourceStore.items);
      const destItems = Array.from(destStore.items);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const newStores = stores.map(store => {
        if (store.id === sourceStore.id) return { ...store, items: sourceItems };
        if (store.id === destStore.id) return { ...store, items: destItems };
        return store;
      });

      setStores(newStores);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable 
          droppableId="ROOT" 
          type="group"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {stores.map((store, index) => (
                <Draggable
                  key={store.id}
                  draggableId={store.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div 
                        {...provided.dragHandleProps}
                        className="p-3 border-b border-gray-200 font-medium"
                      >
                        {store.name}
                      </div>
                      <Droppable 
                        droppableId={store.id}
                        isDropDisabled={false}
                        isCombineEnabled={false}
                        ignoreContainerClipping={false}
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-2 min-h-[50px]"
                          >
                            {store.items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-2 mb-2 rounded-md ${
                                      snapshot.isDragging
                                        ? "bg-gray-100"
                                        : "bg-gray-50"
                                    }`}
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}