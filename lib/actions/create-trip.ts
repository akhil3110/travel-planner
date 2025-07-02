"use server"
import { auth } from "@/auth"
import { prisma } from "../prisma"
import { redirect } from "next/navigation"

export async function createTrip(formdata: FormData) {

    const session =  await auth()

    if(!session || !session.user?.id){
        throw new Error("User not authenticated")
    }
    
    const title = formdata.get("title")?.toString()
    const description = formdata.get("description")?.toString()
    const starteDateStr = formdata.get("startDate")?.toString()
    const endDateStr = formdata.get("endDate")?.toString()


    if(!title  || !description || !starteDateStr || !endDateStr){
        throw new Error("All fields Are required")
    }

    const startDate = new Date(starteDateStr)
    const endDate = new Date(endDateStr)

    await prisma.trip.create({
        data: {
            title,
            description,
            startDate,
            endDate,
            userId: session.user?.id
        }
    })    

    redirect("/trips")
}