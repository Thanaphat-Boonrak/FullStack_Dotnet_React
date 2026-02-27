import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilter from "./ActivityFilter";

export default function ActivityDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <ActivityList></ActivityList>
      </Grid>
      <Grid size={4}>
        <ActivityFilter></ActivityFilter>
      </Grid>
    </Grid>
  );
}
