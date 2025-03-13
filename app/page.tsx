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
import { postDogs } from "./api/dogs/postDogs";
import { getDogBreeds } from "./api/dogs/getDogBreeds";
import type { DogSearchResponse } from "./api/dogs/searchDogs";

const ROWS_PER_PAGE = 6;

export default function Home() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [dogResults, setDogResults] = useState<DogSearchResponse | null>(null);
  const [fetchedDogs, setFetchedDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setError("");
        setIsLoading(true);

        const breedsList = await getDogBreeds();
        setBreeds(breedsList);

        const results = await searchDogs({ size: 100 });
        setDogResults(results);

        if (results.resultIds.length > 0) {
          const dogIds = results.resultIds.slice(0, 100);
          const dogDetails = await postDogs(dogIds);
          setFetchedDogs(dogDetails);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
    setPage(0); // Reset to first page when changing filters
  };

  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setPage(0);
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

  const filteredDogs = selectedBreeds.length
    ? fetchedDogs.filter((dog) => selectedBreeds.includes(dog.breed))
    : fetchedDogs;

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
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Found {dogResults.total} dogs in search results
          </Typography>
          {fetchedDogs.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Showing details for {fetchedDogs.length} dogs
            </Typography>
          )}
        </Box>
      )}

      <div className="mb-6">
        <div className="mb-4">
          <DogFilter
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            onChange={handleBreedChange}
          />
        </div>
        <div className="flex gap-2">
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
      </div>

      {fetchedDogs.length > 0 ? (
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
      ) : (
        !error && <Typography>No dogs found</Typography>
      )}
    </main>
  );
}
