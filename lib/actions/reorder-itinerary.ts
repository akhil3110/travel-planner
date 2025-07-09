"use server"

import { auth } from "@/auth"
import { prisma } from "../prisma"

export async function reorderItinerary(tripId: string, newLocationOrder: string[]) {
    const session =  await auth()
    
    if(!session || !session.user?.id){
        throw new Error("User not authenticated")
    }

    await prisma.$transaction(newLocationOrder.map((locationId:string,key: number) => prisma.location.update({
        where: {
            id: locationId
        },
        data: {
            order: key
        }
    })))
}