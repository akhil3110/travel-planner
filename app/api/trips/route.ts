import { auth } from "@/auth";
import { getCountryFromCordinates } from "@/lib/actions/geoCode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface LocType {
    locationTitle: string,
    lat: number,
    lng: number,
    trip: {
        title: string
    }

}

export async function GET () {
    try {
        
        const session = await auth()
        if(!session){
            return new NextResponse("Not Authenticated", {status:401})
        }

        const locations = await prisma.location.findMany({
            where: {
                trip : {
                    userId: session.user?.id
                }
            },
            select: {
                locationTitle: true,
                lat: true,
                lng: true,
                trip: {
                    select: {
                        title: true
                    }
                }
            }
        });

        
        const tranformedLocation = await Promise.all(locations.map(async(loc:LocType) =>{
        const geoCodeResult = await getCountryFromCordinates(loc.lat,loc.lng)
            
            return {
                name: `${loc.trip.title} - ${geoCodeResult.formattedAddress}`,
                lat: loc.lat,
                lng: loc.lng,
                country: geoCodeResult.country
            }
        }))

        return NextResponse.json(tranformedLocation)

    } catch (error) {
        return new NextResponse(`Internal Error : ${error}`, {status:500})
    }
}