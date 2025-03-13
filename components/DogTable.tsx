import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Dog } from "../types/Dog";
import DogTableCell from "./DogTableCell";

interface DogTableProps {
  dogs: Dog[];
}

const DogTable = ({ dogs }: DogTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "white" }}>
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
          {dogs.map((dog, index) => (
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
  );
};

export default DogTable;
