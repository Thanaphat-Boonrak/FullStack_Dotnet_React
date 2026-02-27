import { Info, CalendarToday, Place } from "@mui/icons-material";
import { Paper, Typography, Divider, Grid, Box, Button } from "@mui/material";
import type { Activity } from "../../../../lib/types/activity";
import { dateFormat } from "../../../../lib/utils/utils";
import { useState } from "react";
import MapComponent from "../../../../shared/components/MapComponent";
type Props = {
  activity: Activity;
};

export default function ActivityDetailsInfo({ activity }: Props) {
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <Paper sx={{ mb: 2 }}>
      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <Info color="info" fontSize="large" />
        </Grid>
        <Grid size={11}>
          <Typography>{activity.description}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <CalendarToday color="info" fontSize="large" />
        </Grid>
        <Grid size={11}>
          <Typography>{dateFormat(activity.date)}</Typography>
        </Grid>
      </Grid>
      <Divider />

      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <Place color="info" fontSize="large" />
        </Grid>
        <Grid
          size={11}
          pr={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            {activity.venue}, {activity.city}
          </Typography>
          <Button onClick={() => setMapOpen(!mapOpen)}>
            {mapOpen ? "Hide Map" : "Show Map"}
          </Button>
        </Grid>
      </Grid>
      {mapOpen && (
        <Box sx={{ height: 400, zIndex: 1000, display: "block" }}>
          <MapComponent
            position={[activity.latitude, activity.longitude]}
            venue={activity.venue}
          />
        </Box>
      )}
    </Paper>
  );
}
