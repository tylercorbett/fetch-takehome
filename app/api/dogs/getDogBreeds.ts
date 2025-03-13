import { API_BASE_URL } from "../../config";
import { API_PATHS } from "../constants";

export async function getDogBreeds(): Promise<string[]> {
  try {
    const url = `${API_BASE_URL}${API_PATHS.DOGS}/breeds`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dog breeds: ${response.statusText}`);
    }

    const breeds: string[] = await response.json();
    return breeds;
  } catch (error) {
    console.error("Error fetching dog breeds:", error);
    throw error;
  }
}
