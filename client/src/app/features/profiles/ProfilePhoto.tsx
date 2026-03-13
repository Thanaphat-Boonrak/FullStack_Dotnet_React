import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import {
  Box,
  Button,
  Divider,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PhotoUploadWidget from "../../shared/components/PhotoUploadWidget";
import StarButton from "../../shared/components/StarButton";
import DeleteButton from "../../shared/components/DeleteButton";

export default function ProfilePhoto() {
  const { id } = useParams();
  const {
    photos,
    loadingPhoto,
    isCurrentUser,
    uploadPhoto,
    profile,
    setMainPhoto,
    deletePhoto,
  } = useProfile(id);
  const [editMode, setEditMode] = useState(false);

  const handleUploadPhoto = (file: Blob) => {
    uploadPhoto.mutateAsync(file, {
      onSuccess: () => {
        setEditMode(false);
      },
    });
  };

  if (loadingPhoto) return <Typography>Loading ...</Typography>;
  if (!photos) return <Typography>No Photos found this user</Typography>;
  return (
    <Box>
      {isCurrentUser && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Photos</Typography>
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Add Photo"}
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }}></Divider>

      {editMode ? (
        <PhotoUploadWidget
          uploadPhoto={handleUploadPhoto}
          loading={uploadPhoto.isPending}
        />
      ) : (
        <>
          {photos.length === 0 ? (
            <Typography>No Photo</Typography>
          ) : (
            <ImageList
              sx={{ width: 500, height: 450 }}
              cols={3}
              rowHeight={164}
            >
              {photos.map((item) => (
                <ImageListItem key={item.id}>
                  <img
                    srcSet={`${item.url.replace("/upload", "/upload/w_164,h_164,c_fill,f_auto,dpr_2,g_face/")}`}
                    src={`${item.url.replace("/upload", "/upload/w_164,h_164,c_fill,f_auto,g_face/")}`}
                    alt={item.url}
                    loading="lazy"
                  />
                  {isCurrentUser && (
                    <Box>
                      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
                        <StarButton
                          selected={item.url === profile?.imageUrl}
                          isDisabled={item.url === profile?.imageUrl}
                          click={() => setMainPhoto.mutate(item)}
                        />
                      </Box>

                      {profile?.imageUrl !== item.url && (
                        <Box
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deletePhoto.mutate(item.id)}
                        >
                          <DeleteButton />
                        </Box>
                      )}
                    </Box>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </>
      )}
    </Box>
  );
}
