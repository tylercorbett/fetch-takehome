import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { Dog } from "../types/Dog";
import DogTableCell from "./DogTableCell";
import { useState } from "react";

interface DogTableProps {
  dogs: Dog[];
}

const ROWS_PER_PAGE = 6;

const DogTable = ({ dogs }: DogTableProps) => {
  const [page, setPage] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Calculate the current page's data
  const currentDogs = dogs.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ backgroundColor: "white" }}>
        <Table sx={{ minWidth: 650 }} aria-label="dog table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3A0F36" }}>
              <DogTableCell isHeader>Image</DogTableCell>
              <DogTableCell isHeader>Name</DogTableCell>
              <DogTableCell isHeader>Age</DogTableCell>
              <DogTableCell isHeader>Breed</DogTableCell>
              <DogTableCell isHeader>Zip Code</DogTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDogs.map((dog, index) => (
              <TableRow
                key={dog.id}
                sx={{ backgroundColor: index % 2 === 0 ? "white" : "#f8f8f8" }}
              >
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
        onPageChange={handleChangePage}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
      />
    </Paper>
  );
};

export default DogTable;
