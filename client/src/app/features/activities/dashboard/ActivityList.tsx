import { Box, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types/activity";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { observer } from "mobx-react-lite";

const ActivityList = observer(function ActivityList() {
  const { activitiesGroup, isLoading, hasNextPage, fetchNextPage } =
    useActivities();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!activitiesGroup) return <Typography>No Activities</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activitiesGroup.pages.map((page, index) => (
        <Fragment key={index}>
          {page.items.map((activity: Activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}

      <Box ref={ref} sx={{ height: 10, visibility: "hidden" }} />
    </Box>
  );
});

export default ActivityList;
