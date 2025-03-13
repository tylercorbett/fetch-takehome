import { TableCell, TableCellProps } from "@mui/material";

interface DogTableCellProps extends TableCellProps {
  isHeader?: boolean;
}

const DogTableCell = ({ isHeader = false, ...props }: DogTableCellProps) => {
  return (
    <TableCell
      sx={{
        fontSize: isHeader ? "1.2rem" : "1.1rem",
        fontWeight: isHeader ? "bold" : "normal",
        color: isHeader ? "white" : "inherit",
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default DogTableCell;
