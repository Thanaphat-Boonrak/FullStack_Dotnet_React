import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  type EditProfileSchema,
} from "../../lib/schema/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../shared/components/TextInput";

export default function ProfileAbout() {
  const [editMode, setEdit] = useState(false);
  const { id } = useParams();
  const { profile, isCurrentUser, updateProfile } = useProfile(id);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<EditProfileSchema>({
    mode: "onTouched",
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
      bio: profile?.bio ?? "",
    },
  });

  const onSubmit = async (data: EditProfileSchema) => {
    await updateProfile.mutateAsync(data, {
      onSuccess: () => {
        setEdit(false);
      },
    });
  };

  return (
    <Box>
      {isCurrentUser && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">About {profile?.displayName}</Typography>
          <Button onClick={() => setEdit(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }}></Divider>

      {editMode ? (
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            label="Display Name"
            control={control}
            name="displayName"
          ></TextInput>
          <TextInput
            control={control}
            label="Add Your Bio"
            placeholder="Add your bio"
            name="bio"
            multiline
            rows={4}
          ></TextInput>
          <Button
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
            variant="contained"
            size="large"
          >
            UPDATE PROFILE
          </Button>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto", maxHeight: 350 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {profile?.bio || "No description added yet"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
