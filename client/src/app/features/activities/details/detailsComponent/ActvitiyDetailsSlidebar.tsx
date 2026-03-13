import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Grid,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import type { Activity } from "../../../../lib/types/activity";
import { Link } from "react-router";

type Props = {
  activity: Activity;
};

export default function ActivityDetailsSidebar({ activity }: Props) {
  return (
    <>
      <Paper
        sx={{
          textAlign: "center",
          border: "none",
          backgroundColor: "primary.main",
          color: "white",
          p: 2,
        }}
      >
        <Typography variant="h6">
          {activity.attendees?.length} people going
        </Typography>
      </Paper>
      <Paper sx={{ padding: 2 }}>
        {activity.attendees?.map((att) => (
          <Grid container key={att.id} alignItems="center">
            <Grid size={8}>
              <List sx={{ display: "flex", flexDirection: "column" }}>
                <ListItem component={Link} to={`/profiles/${att.id}`}>
                  <ListItemAvatar>
                    <Avatar
                      alt={att.displayName + " image"}
                      src={att.imageUrl || "/images/user.png"}
                    />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="h6">{att.displayName}</Typography>
                    {att.isFollowing && (
                      <Typography variant="body2" color="orange">
                        Following
                      </Typography>
                    )}
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
            <Grid
              size={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {activity.hostId === att.id && (
                <Chip
                  label="Host"
                  color="warning"
                  variant="filled"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Grid>
          </Grid>
        ))}
      </Paper>
    </>
  );
}
