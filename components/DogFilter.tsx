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
      disableCloseOnSelect
      onChange={(event: React.SyntheticEvent, newValue) =>
        onChange(newValue as string[])
      }
      renderInput={(params) => (
        <TextField {...params} label="Breed" variant="outlined" />
      )}
    />
  );
};

export default DogFilter;
