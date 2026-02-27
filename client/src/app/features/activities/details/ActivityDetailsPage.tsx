import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./detailsComponent/ActivityDetailsHeader";
import ActivityDetailsInfo from "./detailsComponent/ActivityDetailsInfo";
import ActivityDetailsChat from "./detailsComponent/ActivityDetailsChat";
import ActvitiyDetailsSlidebar from "./detailsComponent/ActvitiyDetailsSlidebar";

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) return <Typography>Loading ...</Typography>;
  if (!activity) return <Typography>Activity Not Found</Typography>;
  return (
    <Grid container spacing={5}>
      <Grid size={8}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </Grid>
      <Grid size={4}>
        <ActvitiyDetailsSlidebar activity={activity}></ActvitiyDetailsSlidebar>
      </Grid>
    </Grid>
  );
}
