"use client";
import DogTable from "../components/DogTable";
import { Dog } from "../types/Dog";

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

export default function Home() {
  return (
    <main className="p-12 bg-off-white min-h-screen">
      <DogTable dogs={sampleDogs} />
    </main>
  );
}
