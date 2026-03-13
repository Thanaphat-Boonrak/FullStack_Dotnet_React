import { Paper, Typography, Box, Button } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  activitySchema,
  type ActivityFormInput,
} from "../../../lib/schema/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import SelectInput from "../../../shared/components/SelectInput";
import { categoryOptions } from "../../../lib/schema/categryOptions";
import DateTimeInput from "../../../shared/components/DateTimeInput";
import LocationInput from "../../../shared/components/LocationInput";
import type { Activity } from "../../../lib/types/activity";

export default function ActivityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm<ActivityFormInput>({
    mode: "onTouched",
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: new Date(),
      location: undefined,
    },
  });

  const { updateActivity, createActivity, activity } = useActivities(id);

  useEffect(() => {
    if (activity) {
      reset({
        title: activity.title,
        description: activity.description,
        category: activity.category,
        date: new Date(activity.date),
        location: {
          city: activity.city,
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
        },
      });
    }
  }, [activity, reset]);

  const onSubmit = (data: ActivityFormInput) => {
    const parsed = activitySchema.parse(data);
    console.log(parsed);

    const payload: Activity = {
      id: activity?.id || "",
      isCancelled: false,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      date: parsed.date,
      venue: parsed.location!.venue,
      city: parsed.location!.city!,
      latitude: parsed.location!.latitude,
      longitude: parsed.location!.longitude!,
    };
    try {
      if (activity) {
        updateActivity.mutate(
          { ...activity, ...payload },
          {
            onSuccess: () => navigate(`/activities/${activity.id}`),
          },
        );
      } else {
        createActivity.mutate(payload, {
          onSuccess: (id) => navigate(`/activities/${id}`),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? "Edit Activity" : "Create Activity"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextInput name="title" control={control} label="Title" />

        <TextInput
          name="description"
          control={control}
          label="Description"
          multiline
          rows={3}
        />

        <Box sx={{ display: "flex", gap: 3 }}>
          <SelectInput
            items={categoryOptions}
            name="category"
            control={control}
            label="Category"
          />
          <DateTimeInput name="date" control={control} label="Date" />
        </Box>

        <LocationInput
          control={control}
          label="Enter location"
          name="location"
        />

        <Box display="flex" justifyContent="flex-end" gap={3}>
          <Button color="inherit" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
