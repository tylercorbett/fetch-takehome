import { API_BASE_URL } from "../../config";
import { API_PATHS } from "../constants";

export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface SearchDogsParams {
  size?: number;
}

export async function searchDogs(
  params: SearchDogsParams = { size: 100 }
): Promise<DogSearchResponse> {
  try {
    const searchParams = new URLSearchParams();

    searchParams.append("size", (params.size || 100).toString());

    const url = `${API_BASE_URL}${
      API_PATHS.DOGS
    }/search?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Dog search failed: ${response.statusText}`);
    }

    const data: DogSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Dog search error:", error);
    throw error;
  }
}
