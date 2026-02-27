import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Photo, Profile, User } from "../types/activity";
import agent from "../api/agents";
import { useMemo } from "react";
import type { EditProfileSchema } from "../schema/editProfileSchema";

export const useProfile = (id?: string) => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: photos, isLoading: loadingPhoto } = useQuery<Photo[]>({
    queryKey: ["photos", id],
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    enabled: !!id,
  });

  const deletePhoto = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/profiles/${id}/photos`);
    },
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(["photos", id], (photos: Photo[]) => {
        return photos.filter((p) => p.id !== photoId);
      });
    },
  });

  const isCurrentUser = useMemo(() => {
    return id === queryClient.getQueryData<User>(["user"])?.id;
  }, [id, queryClient]);

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await agent.post("profiles/add-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },

    onSuccess: async (photo: Photo) => {
      await queryClient.invalidateQueries({
        queryKey: ["photos", id],
      });
      queryClient.setQueryData(["user"], (data: User) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });

      queryClient.setQueryData(["profile", id], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });
    },
  });

  const setMainPhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      await agent.put(`/profiles/${photo.id}/setMain`);
    },
    onSuccess: (_, photo: Photo) => {
      queryClient.setQueryData(["user"], (userData: User) => {
        if (!userData) return;
        return {
          ...userData,
          imageUrl: photo.url,
        };
      });

      queryClient.setQueryData(["profile", id], (profile: Profile) => {
        if (!profile) return;
        return {
          ...profile,
          imageUrl: photo.url,
        };
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: EditProfileSchema) => {
      await agent.put("/profiles", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });

  return {
    profile,
    loadingProfile,
    photos,
    loadingPhoto,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    updateProfile,
  };
};
