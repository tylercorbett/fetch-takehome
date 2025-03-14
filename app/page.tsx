"use client";
import DogTable from "../components/DogTable";
import { Dog } from "../types/Dog";
import DogFilter from "../components/DogFilter";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useUser } from "./context/UserContext";
import { useRouter } from "next/navigation";
import { searchDogs } from "./api/dogs/searchDogs";
import { postDogs } from "./api/dogs/postDogs";
import { getDogBreeds } from "./api/dogs/getDogBreeds";
import { postDogsMatch } from "./api/dogs/postDogsMatch";
import type {
  DogSearchResponse,
  SearchDogsParams,
} from "./api/dogs/searchDogs";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import CloseIcon from "@mui/icons-material/Close";
import { searchLocations } from "./api/locations/searchLocations";
import type { Location } from "./types/Location";

const ROWS_PER_PAGE = 6;

export default function Home() {
  const { width, height } = useWindowSize();
  const { user, logout } = useUser();
  const router = useRouter();
  const [dogIDs, setDogIDs] = useState<DogSearchResponse | null>(null);
  const [fetchedDogs, setFetchedDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [locationDetails, setLocationDetails] = useState<Location | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [searchNearMe, setSearchNearMe] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setError("");
        setIsInitialLoading(true);

        const breedsList = await getDogBreeds();
        setBreeds(breedsList);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setError("");
        setIsFilterLoading(true);

        const searchParams: SearchDogsParams = {
          size: 100,
          breeds: selectedBreeds,
        };

        // Add zip codes to search params if searching near me and we have locations
        if (searchNearMe && nearbyLocations.length > 0) {
          searchParams.zipCodes = nearbyLocations
            .slice(0, 20)
            .map((loc) => loc.zip_code);
        }

        const results = await searchDogs(searchParams);
        setDogIDs(results);

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
        setIsFilterLoading(false);
      }
    };

    fetchDogs();
  }, [selectedBreeds, searchNearMe, nearbyLocations]);

  if (!user) {
    return null;
  }

  if (isInitialLoading) {
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

  const handlePageChange = async (event: unknown, newPage: number) => {
    setPage(newPage);

    const totalPages = Math.ceil(filteredDogs.length / ROWS_PER_PAGE);

    const isLastPage = newPage === totalPages - 1;
    if (isLastPage && dogIDs?.next) {
      try {
        setIsLoadingMore(true);
        setError("");

        // Use the next query string directly from the API response
        if (dogIDs.next) {
          const nextResults = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${dogIDs.next}`,
            { credentials: "include" }
          );
          const nextData = await nextResults.json();
          setDogIDs(nextData);

          // If we get new dog IDs, fetch the details and add them to the existing list
          if (nextData.resultIds.length > 0) {
            const newDogDetails = await postDogs(nextData.resultIds);
            setFetchedDogs((prevDogs) => [...prevDogs, ...newDogDetails]);
          }
        }
      } catch (err) {
        setError("Failed to load more dogs. Please try again later.");
        console.error("Error loading more dogs:", err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const handleSortToggle = async () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    try {
      setIsFilterLoading(true);
      setError("");

      const results = await searchDogs({
        size: 100,
        breeds: selectedBreeds,
        sort: `breed:${newOrder}`,
      });
      setDogIDs(results);

      if (results.resultIds.length > 0) {
        const dogDetails = await postDogs(results.resultIds);
        setFetchedDogs(dogDetails);
      } else {
        setFetchedDogs([]);
      }
    } catch (err) {
      setError("Failed to sort dogs. Please try again later.");
      console.error("Error sorting dogs:", err);
    } finally {
      setIsFilterLoading(false);
    }
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

  const handleClearMatch = () => {
    setMatchedDog(null);
  };

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError("");
    setLocationDetails(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      setUserLocation(coords);

      // Search for location details using coordinates with a larger bounding box
      const boundingBox = {
        top: coords.lat + 0.5, // Approximately 55km north
        bottom: coords.lat - 0.5, // Approximately 55km south
        left: coords.lon - 0.5, // Approximately 55km west
        right: coords.lon + 0.5, // Approximately 55km east
      };

      const locationResponse = await searchLocations({
        geoBoundingBox: boundingBox,
        size: 20, // Get up to 20 nearby locations
      });

      if (locationResponse.results.length > 0) {
        // Store the first location as the primary location for display
        setLocationDetails(locationResponse.results[0]);
        // Store all locations for searching
        setNearbyLocations(locationResponse.results);
      }
    } catch (err) {
      setLocationError("Unable to retrieve your location");
      console.error("Geolocation error:", err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const filteredDogs = selectedBreeds.length
    ? fetchedDogs.filter((dog) => selectedBreeds.includes(dog.breed))
    : fetchedDogs;

  const currentDogs = filteredDogs.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  const handleLogout = async () => {
    router.push("/login");
    await logout();
  };

  return (
    <main className="p-12 bg-white min-h-screen min-w-fit">
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

      <div className="mb-4">
        <DogFilter
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          onChange={handleBreedChange}
        />
      </div>

      <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={handleGetLocation}
            variant="outlined"
            disabled={isLoadingLocation}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            {isLoadingLocation ? "Getting Location..." : "Get My Location"}
          </Button>
          {locationDetails ? (
            <>
              <Typography variant="body2">
                📍 {locationDetails.city}, {locationDetails.state}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
              >
                <input
                  type="checkbox"
                  id="nearMe"
                  checked={searchNearMe}
                  onChange={(e) => {
                    setSearchNearMe(e.target.checked);
                    setPage(0);
                    // Trigger a new search when the checkbox changes
                    if (e.target.checked && !locationDetails) {
                      handleGetLocation();
                    }
                  }}
                />
                <label htmlFor="nearMe">
                  Search for dogs in {nearbyLocations.length} nearby{" "}
                  {nearbyLocations.length === 1 ? "location" : "locations"}
                </label>
              </Box>
            </>
          ) : isLoadingLocation ? (
            <CircularProgress size={20} />
          ) : userLocation && !locationError ? (
            <Typography variant="body2" color="text.secondary">
              Unable to locate city
            </Typography>
          ) : null}
        </div>
        {locationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {locationError}
          </Alert>
        )}
        {isFilterLoading || isLoadingMore ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">
              {isLoadingMore ? "Loading more dogs..." : "Loading dogs"}
            </Typography>
            <CircularProgress size={20} />
          </Box>
        ) : (
          dogIDs && (
            <>
              <Typography variant="body1">
                Found {dogIDs.total.toLocaleString()} dogs in search results
              </Typography>
              {fetchedDogs.length > 0 && (
                <Typography variant="body2">
                  Showing details for {fetchedDogs.length.toLocaleString()} dogs
                </Typography>
              )}
            </>
          )
        )}
      </Box>

      <div className="mb-6">
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
              >
                Clear Favorites
              </Button>
              <Button
                onClick={handleGetMatch}
                variant="contained"
                color="primary"
                disabled={isMatchLoading}
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
              position: "relative",
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClearMatch}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                You&apos;ve been matched with {matchedDog.name}!
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
          totalDogs={filteredDogs.length}
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
