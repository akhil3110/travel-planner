"use server"

interface GeocodeResult {
    country: string,
    formattedAddress: string
}

export async function getCountryFromCordinates (lat: number,lng:number): Promise<GeocodeResult>{

    const apiKey = process.env.GOOGLE_MAPS_API_KEY!;

    const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data =  await response.json()

    const result = data.results[0]

    //@ts-expect-error: no check
    const countryComponent = result.address_components.find((comp) => comp.types.includes("country"))

    return {
        country: countryComponent.long_name || "Unknown",
        formattedAddress: result.formattedAddress
    }

}