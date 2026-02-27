import { Box, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types/activity";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityList() {
  const { Activities, isLoading } = useActivities();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!Activities) return <Typography>No Activities</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {Activities.map((activity: Activity) => {
        return <ActivityCard key={activity.id} activity={activity} />;
      })}
    </Box>
  );
}
