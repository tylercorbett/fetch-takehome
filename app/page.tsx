"use client";
import DogTable from "../components/DogTable";
import { Dog } from "../types/Dog";
import DogFilter from "../components/DogFilter";
import React, { useState } from "react";
import Button from "@mui/material/Button";

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
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  return (
    <main className="p-12 bg-off-white min-h-screen">
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
              borderColor: "#4081EC",
              color: "#4081EC",
              "&:hover": {
                borderColor: "#4081EC",
                backgroundColor: "#4081EC",
                color: "white",
              },
            }}
            className="mt-4"
          >
            Clear Filters
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
        sortedDogs={sortedDogs}
        currentDogs={currentDogs}
        rowsPerPage={ROWS_PER_PAGE}
      />
    </main>
  );
}
