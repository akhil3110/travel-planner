import { auth } from "@/auth";
import TripDetailClient from "@/components/trip-detail";
import { prisma } from "@/lib/prisma";



const TripDetail = async({
    params
} : {
    params: Promise<{tripId : string}>
}) => {

    const {tripId} = await params
    const session =  await auth()

    if(!session){
        return <div>
            Please Sig In
        </div>
    }

    const trip = await prisma.trip.findFirst({
        where: {
            id: tripId,
            userId: session.user?.id
        },
        include: {
            location: true
        }
    })

    console.log(trip)

    if(!trip){
        return <div>Trip Not Found</div>
    }

    return <TripDetailClient trip={trip} />;
}
 
export default TripDetail;