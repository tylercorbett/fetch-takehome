import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface DogFilterProps {
  breeds: string[];
  selectedBreeds: string[];
  onChange: (breeds: string[]) => void;
}

const DogFilter: React.FC<DogFilterProps> = ({
  breeds,
  selectedBreeds,
  onChange,
}) => {
  return (
    <Autocomplete
      multiple
      options={breeds}
      value={selectedBreeds}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Filter by Breed" variant="outlined" />
      )}
    />
  );
};

export default DogFilter;
