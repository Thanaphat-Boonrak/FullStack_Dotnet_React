import { Star, StarBorder } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

type Props = {
  selected: boolean;
};

export default function StarButton({ selected }: Props) {
  return (
    <Box>
      <Button
        sx={{
          opacity: 0.8,
          transition: "opacity 0.3s",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <StarBorder
          sx={{ position: "absolute", fontSize: 32, color: "white" }}
        />
        <Star
          sx={{ fontSize: 28, color: selected ? "yellow" : "rgba(0,0,0,0.5)" }}
        />
      </Button>
    </Box>
  );
}
