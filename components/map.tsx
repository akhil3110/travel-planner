"use client"

import { Location } from "@/app/generated/prisma";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api"

interface MapProps{
    itineraries : Location[]
}

const Map = ({itineraries}: MapProps) => {
    
    const {isLoaded,loadError} = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })
    

    if(!isLoaded){
        return <div> Loadind Maps ... </div>
    }

    if(loadError){
        return <div> Error Loading Map</div>
    }

    const center = itineraries.length > 0  ? {lat: itineraries[0].lat, lng: itineraries[0].lng} : {lat: 0, lng: 0}

    return (
        <GoogleMap 
            mapContainerStyle={{width: "100%", height: "100%"}}
            zoom={5}
            center={center}
        >
            {itineraries.map((location,key) =>(
                <Marker key={key} position={{lat: location.lat, lng: location.lng}} title={location.locationTitle}/>
            ))}
        </GoogleMap>
    )
}
 
export default Map;