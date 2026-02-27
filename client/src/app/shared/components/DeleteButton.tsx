import { Delete, DeleteOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export default function DeleteButton() {
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
        <DeleteOutline
          sx={{ position: "absolute", fontSize: 32, color: "white" }}
        />
        <Delete sx={{ fontSize: 28, color: "red" }} />
      </Button>
    </Box>
  );
}
