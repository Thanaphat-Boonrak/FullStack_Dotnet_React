import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Link, useParams } from "react-router";
import { useComment } from "../../../../lib/hooks/useComment";
import { timeAgo } from "../../../../lib/utils/utils";
import { useForm, type FieldValues } from "react-hook-form";
import { observer } from "mobx-react-lite";

const ActivityDetailsChat = observer(function ActivityDetailsChat() {
  const { id } = useParams();
  const { commentStore } = useComment(id);
  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const addComment = async (data: FieldValues) => {
    try {
      await commentStore.hubConnection?.invoke("SendComment", {
        activityId: id,
        body: data.body,
      });
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyPressDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(addComment)();
    }
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          padding: 2,
        }}
      >
        <Typography variant="h6">Chat about this event</Typography>
      </Box>
      <Card>
        <CardContent>
          <div>
            <form>
              <TextField
                {...register("body", { required: true })}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                onKeyDown={handleKeyPressDown}
                slotProps={{
                  input: {
                    endAdornment: isSubmitting ? (
                      <CircularProgress size={24}></CircularProgress>
                    ) : null,
                  },
                }}
              />
            </form>
          </div>

          <Box sx={{ height: 400, overflow: "auto" }}>
            {commentStore.comments.map((c) => (
              <>
                <Box key={c.id} sx={{ display: "flex", my: 2 }}>
                  <Avatar
                    src={`${c.imageUrl}`}
                    alt={"user image"}
                    sx={{ mr: 2 }}
                  />
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center" gap={3}>
                      <Typography
                        component={Link}
                        to={`/profiles/${c.userId}`}
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", textDecoration: "none" }}
                      >
                        {c.displayName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {timeAgo(c.createdAt)}
                      </Typography>
                    </Box>

                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {c.body}
                    </Typography>
                  </Box>
                </Box>
              </>
            ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
});

export default ActivityDetailsChat;
