import { Event, FilterList } from "@mui/icons-material";
import {
  Box,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useStore } from "../../../lib/hooks/useStore";
import { observer } from "mobx-react-lite";
const ActivityFilter = observer(function ActivityFilter() {
  const {
    activityStore: { setFilter, setStartDate, filter, startDate },
  } = useStore();
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, borderRadius: 3 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "primary.main",
            }}
          >
            <FilterList sx={{ mr: 1 }}></FilterList>
            Filters
          </Typography>
          <MenuList>
            <MenuItem
              selected={filter === "all"}
              onClick={() => setFilter("all")}
            >
              <ListItemText primary="All events"></ListItemText>
            </MenuItem>
          </MenuList>
          <MenuList>
            <MenuItem
              selected={filter === "isGoing"}
              onClick={() => setFilter("isGoing")}
            >
              <ListItemText primary="I'm going"></ListItemText>
            </MenuItem>
          </MenuList>
          <MenuList>
            <MenuItem
              selected={filter === "isHost"}
              onClick={() => setFilter("isHost")}
            >
              <ListItemText primary="I'm hosting"></ListItemText>
            </MenuItem>
          </MenuList>
        </Box>
      </Paper>
      <Box component={Paper} sx={{ width: "100%", p: 3, borderRadius: 3 }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Event sx={{ mr: 1 }}>Select Date</Event>
        </Typography>
        <Calendar
          value={startDate}
          onChange={(date) => setStartDate(date as Date)}
        />
      </Box>
    </Box>
  );
});

export default ActivityFilter;
