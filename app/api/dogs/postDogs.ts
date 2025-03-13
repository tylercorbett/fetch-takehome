import { API_BASE_URL } from "../../config";
import { API_PATHS } from "../constants";
import { Dog } from "../../../types/Dog";

export async function postDogs(dogIds: string[]): Promise<Dog[]> {
  try {
    if (dogIds.length > 100) {
      throw new Error("Cannot fetch more than 100 dogs at once");
    }

    const response = await fetch(`${API_BASE_URL}${API_PATHS.DOGS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dogs: ${response.statusText}`);
    }

    const data: Dog[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
}
