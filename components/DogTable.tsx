import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Dog } from "../types/Dog";

interface DogTableProps {
  dogs: Dog[];
}

const DogTable = ({ dogs }: DogTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="dog table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Breed</TableCell>
            <TableCell>Zip Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dogs.map((dog) => (
            <TableRow key={dog.id}>
              <TableCell>
                <img
                  src={dog.img}
                  alt={dog.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </TableCell>
              <TableCell>{dog.name}</TableCell>
              <TableCell>{dog.age}</TableCell>
              <TableCell>{dog.breed}</TableCell>
              <TableCell>{dog.zip_code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DogTable;
