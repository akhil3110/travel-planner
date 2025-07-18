"use client"


import {DndContext, closestCenter, DragEndEvent} from "@dnd-kit/core"
import {arrayMove, SortableContext, verticalListSortingStrategy, useSortable} from "@dnd-kit/sortable"
import { useId, useState } from "react";
import {CSS} from "@dnd-kit/utilities"
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import { Location } from "@prisma/client";


interface SortableItineraryProp {
    location: Location[],
    tripId: string
}

function SortableItem({item}: {item: Location}){

    const {attributes,listeners,setNodeRef,transform,transition} = useSortable({id: item.id})

    return (
        <div 
            className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{transform: CSS.Transform.toString(transform),transition}}
        >
            <div className="">
                <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
                <p className="text-sm text-gray-500 truncate max-w-xs">{`Latittude: ${item.lat} , Longitude: ${item.lng}`}</p>
            </div>
            <div className="text-sm text-gray-600">Day {item.order}</div>
        </div>
    )
}

const SortableItinerary =({location,tripId}: SortableItineraryProp) => {
    
    const id = useId()
    const [localLocation,setLocalLocation] = useState(location)
    
    const handleDragEnd = async(event: DragEndEvent) => {
        const {active,over} = event

        if(active.id !== over?.id){
            const oldIndex = localLocation.findIndex((item) => item.id === active.id);
            const newIndex = localLocation.findIndex((item) => item.id === over?.id);

            const newLocationsOrder = arrayMove(localLocation,oldIndex,newIndex).map((item,index) => ({...item, order:index}))
            setLocalLocation(newLocationsOrder)

            reorderItinerary(tripId,newLocationsOrder.map((item) => item.id))
        }
    }

    return ( 
        <DndContext 
            id={id} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
            <SortableContext strategy={verticalListSortingStrategy} items={localLocation.map((loc) => loc.id)}>
                <div className="space-y-4">
                    {localLocation.map((item,key) => (
                        <SortableItem key={key} item={item}>

                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
     );
}
 
export default SortableItinerary;