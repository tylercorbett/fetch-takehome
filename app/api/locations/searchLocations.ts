import type {
  LocationSearchResponse,
  SearchLocationsParams,
} from "../../types/Location";

export async function searchLocations(
  params: SearchLocationsParams
): Promise<LocationSearchResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search locations");
    }

    return response.json();
  } catch (error) {
    console.error("Error in searchLocations:", error);
    throw error;
  }
}
