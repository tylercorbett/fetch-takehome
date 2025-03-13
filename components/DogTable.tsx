import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Dog } from "../types/Dog";
import DogTableCell from "./DogTableCell";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface DogTableProps {
  dogs: Dog[];
  favorites: Set<string>;
  onFavoriteToggle: (id: string) => void;
  page: number;
  sortOrder: "asc" | "desc";
  onPageChange: (event: unknown, newPage: number) => void;
  onSortToggle: () => void;
}

const ROWS_PER_PAGE = 6;

const DogTable = ({
  dogs,
  favorites,
  onFavoriteToggle,
  page,
  sortOrder,
  onPageChange,
  onSortToggle,
}: DogTableProps) => {
  const sortedDogs = [...dogs].sort((a, b) => {
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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ backgroundColor: "white" }}>
        <Table sx={{ minWidth: 650 }} aria-label="dog table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4081EC" }}>
              <DogTableCell isHeader sx={{ width: "3rem" }}></DogTableCell>
              <DogTableCell isHeader>Image</DogTableCell>
              <DogTableCell isHeader>Name</DogTableCell>
              <DogTableCell isHeader>Age</DogTableCell>
              <DogTableCell isHeader>
                Breed
                <IconButton onClick={onSortToggle} sx={{ color: "white" }}>
                  {sortOrder === "asc" ? (
                    <ArrowDropDownIcon />
                  ) : (
                    <ArrowDropUpIcon />
                  )}
                </IconButton>
              </DogTableCell>
              <DogTableCell isHeader>Zip Code</DogTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDogs.map((dog, index) => (
              <TableRow
                key={dog.id}
                sx={{ backgroundColor: index % 2 === 0 ? "white" : "#f8f8f8" }}
              >
                <DogTableCell sx={{ width: "3rem" }}>
                  <IconButton onClick={() => onFavoriteToggle(dog.id)}>
                    {favorites.has(dog.id) ? (
                      <FavoriteIcon sx={{ color: "pink" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </DogTableCell>
                <DogTableCell>
                  <img
                    src={dog.img}
                    alt={dog.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </DogTableCell>
                <DogTableCell>{dog.name}</DogTableCell>
                <DogTableCell>{dog.age}</DogTableCell>
                <DogTableCell>{dog.breed}</DogTableCell>
                <DogTableCell>{dog.zip_code}</DogTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={dogs.length}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onPageChange={onPageChange}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
      />
    </Paper>
  );
};

export default DogTable;
