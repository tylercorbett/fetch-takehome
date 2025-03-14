import { API_BASE_URL } from "../../config";
import { API_PATHS } from "../constants";

interface Match {
  match: string;
}

export async function postDogsMatch(dogIds: string[]): Promise<Match> {
  try {
    const url = `${API_BASE_URL}${API_PATHS.DOGS}/match`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) {
      throw new Error(`Failed to get dog match: ${response.statusText}`);
    }

    const data: Match = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting dog match:", error);
    throw error;
  }
}
