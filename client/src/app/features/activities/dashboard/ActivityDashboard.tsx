import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilter from "./ActivityFilter";

export default function ActivityDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <ActivityList></ActivityList>
      </Grid>
      <Grid
        size={4}
        sx={{ position: "sticky", top: 112, alignSelf: "flex-start" }}
      >
        <ActivityFilter></ActivityFilter>
      </Grid>
    </Grid>
  );
}
