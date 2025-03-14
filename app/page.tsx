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
import { postDogsMatch } from "./api/dogs/postDogsMatch";
import type { DogSearchResponse } from "./api/dogs/searchDogs";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const ROWS_PER_PAGE = 6;

export default function Home() {
  const { width, height } = useWindowSize();
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
  const [matchedDogId, setMatchedDogId] = useState<string | null>(null);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

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
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setError("");
        setIsLoading(true);

        const results = await searchDogs({
          size: 100,
          breeds: selectedBreeds,
        });
        setDogResults(results);

        if (results.resultIds.length > 0) {
          const dogIds = results.resultIds.slice(0, 100);
          const dogDetails = await postDogs(dogIds);
          setFetchedDogs(dogDetails);
        } else {
          setFetchedDogs([]);
        }
      } catch (err) {
        setError("Failed to fetch dogs. Please try again later.");
        console.error("Error fetching dogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [selectedBreeds]);

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
    setPage(0);
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

  const handleGetMatch = async () => {
    const favoriteIds = Array.from(favorites);
    if (favoriteIds.length === 0) {
      setMatchError("Please favorite at least one dog before getting a match");
      return;
    }

    try {
      setIsMatchLoading(true);
      setMatchError("");
      setMatchedDog(null);
      setShowConfetti(false);

      // Get the match
      const { match } = await postDogsMatch(favoriteIds);
      setMatchedDogId(match);

      // Get the matched dog's details
      const matchedDogDetails = await postDogs([match]);
      if (matchedDogDetails.length > 0) {
        setMatchedDog(matchedDogDetails[0]);
        setShowConfetti(true);
        // Turn off confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      setMatchError("Failed to get a match. Please try again later.");
      console.error("Error getting match:", err);
    } finally {
      setIsMatchLoading(false);
    }
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
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
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
            <>
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
                className="mt-4"
              >
                Clear Favorites
              </Button>
              <Button
                onClick={handleGetMatch}
                variant="contained"
                color="primary"
                disabled={isMatchLoading}
                className="mt-4"
              >
                {isMatchLoading ? "Getting Match..." : "Get Match"}
              </Button>
            </>
          )}
        </div>
        {matchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {matchError}
          </Alert>
        )}
        {matchedDog && (
          <Alert
            severity="success"
            sx={{
              mt: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                You've been matched with {matchedDog.name}!
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  mt: 1,
                }}
              >
                <Box
                  component="img"
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
                <Box>
                  <Typography>
                    <strong>Breed:</strong> {matchedDog.breed}
                  </Typography>
                  <Typography>
                    <strong>Age:</strong> {matchedDog.age}
                  </Typography>
                  <Typography>
                    <strong>Zip Code:</strong> {matchedDog.zip_code}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Congratulations on finding your perfect match! Contact your
                    local shelter to learn more about {matchedDog.name}.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Alert>
        )}
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
