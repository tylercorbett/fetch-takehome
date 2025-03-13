"use client";
import DogTable from "../components/DogTable";
import { Dog } from "../types/Dog";
import DogFilter from "../components/DogFilter";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, Box, Alert } from "@mui/material";
import { useUser } from "./context/UserContext";
import { useRouter } from "next/navigation";
import { searchDogs } from "./api/dogs/searchDogs";
import type { DogSearchResponse } from "./api/dogs/searchDogs";

const sampleDogs: Dog[] = [
  {
    id: "1",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Max",
    age: 3,
    zip_code: "97209",
    breed: "Irish Terrier",
  },
  {
    id: "2",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Luna",
    age: 2,
    zip_code: "97210",
    breed: "Golden Retriever",
  },
  {
    id: "3",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Charlie",
    age: 4,
    zip_code: "97211",
    breed: "Labrador",
  },
  {
    id: "4",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Bella",
    age: 1,
    zip_code: "97212",
    breed: "Poodle",
  },
  {
    id: "5",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Rocky",
    age: 5,
    zip_code: "97213",
    breed: "German Shepherd",
  },
  {
    id: "6",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Lucy",
    age: 2,
    zip_code: "97214",
    breed: "Beagle",
  },
  {
    id: "7",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Duke",
    age: 3,
    zip_code: "97215",
    breed: "Boxer",
  },
  {
    id: "8",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Daisy",
    age: 4,
    zip_code: "97216",
    breed: "Husky",
  },
  {
    id: "9",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Cooper",
    age: 2,
    zip_code: "97217",
    breed: "Rottweiler",
  },
  {
    id: "10",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVGPXGcqV9BNRmofETVWqrFLU_AYEjYQhfA&s",
    name: "Molly",
    age: 1,
    zip_code: "97218",
    breed: "Bulldog",
  },
];

const ROWS_PER_PAGE = 6;

export default function Home() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [dogResults, setDogResults] = useState<DogSearchResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDogs = async () => {
      try {
        setError("");
        setIsLoading(true);
        const results = await searchDogs();
        setDogResults(results);
        console.log("Dog search results:", results);
      } catch (err) {
        setError("Failed to fetch dogs. Please try again later.");
        console.error("Error fetching dogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dogs...</Typography>
      </Box>
    );
  }

  const handleBreedChange = (breeds: string[]) => {
    setSelectedBreeds(breeds);
  };

  const handleClearFilters = () => {
    setSelectedBreeds([]);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleFavoriteToggle = (dogId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const handleClearFavorites = () => {
    setFavorites(new Set());
  };

  const breeds = Array.from(new Set(sampleDogs.map((dog) => dog.breed)));

  const filteredDogs = selectedBreeds.length
    ? sampleDogs.filter((dog) => selectedBreeds.includes(dog.breed))
    : sampleDogs;

  const sortedDogs = [...filteredDogs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.breed.localeCompare(b.breed);
    } else {
      return b.breed.localeCompare(a.breed);
    }
  });

  const currentDogs = sortedDogs.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  const handleLogout = async () => {
    router.push("/login");
    await logout();
  };

  return (
    <main className="p-12 bg-off-white min-h-screen min-w-fit">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Welcome, {user.name}!</Typography>
        <Button
          onClick={handleLogout}
          variant="outlined"
          sx={{
            borderColor: "red",
            color: "red",
            "&:hover": {
              borderColor: "red",
              backgroundColor: "red",
              color: "white",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {dogResults && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Found {dogResults.total} dogs in search results
        </Typography>
      )}

      <div className="mb-6">
        <DogFilter
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          onChange={handleBreedChange}
        />
        {selectedBreeds.length > 0 && (
          <Button
            onClick={handleClearFilters}
            variant="outlined"
            sx={{
              borderColor: "red",
              color: "red",
              "&:hover": {
                borderColor: "red",
                backgroundColor: "red",
                color: "white",
              },
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        )}
        {favorites.size > 0 && (
          <Button
            onClick={handleClearFavorites}
            variant="outlined"
            sx={{
              borderColor: "red",
              color: "red",
              "&:hover": {
                borderColor: "red",
                backgroundColor: "red",
                color: "white",
              },
            }}
            className="mt-4 ml-2"
          >
            Clear Favorites
          </Button>
        )}
      </div>

      <DogTable
        totalDogs={sortedDogs.length}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        page={page}
        sortOrder={sortOrder}
        onPageChange={handlePageChange}
        onSortToggle={handleSortToggle}
        currentDogs={currentDogs}
        rowsPerPage={ROWS_PER_PAGE}
      />
    </main>
  );
}
