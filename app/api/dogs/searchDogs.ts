export interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export interface SearchDogsParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string; // format: field:[asc|desc], e.g., "breed:asc"
}

export async function searchDogs(
  params: SearchDogsParams
): Promise<DogSearchResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.breeds?.length) {
      params.breeds.forEach((breed) => searchParams.append("breeds", breed));
    }

    if (params.zipCodes?.length) {
      params.zipCodes.forEach((zipCode) =>
        searchParams.append("zipCodes", zipCode)
      );
    }

    if (params.ageMin !== undefined) {
      searchParams.append("ageMin", params.ageMin.toString());
    }

    if (params.ageMax !== undefined) {
      searchParams.append("ageMax", params.ageMax.toString());
    }

    if (params.size !== undefined) {
      searchParams.append("size", params.size.toString());
    }

    if (params.from !== undefined) {
      searchParams.append("from", params.from);
    }

    if (params.sort !== undefined) {
      searchParams.append("sort", params.sort);
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/dogs/search?${searchParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dogs");
    }

    return response.json();
  } catch (error) {
    console.error("Error in searchDogs:", error);
    throw error;
  }
}
