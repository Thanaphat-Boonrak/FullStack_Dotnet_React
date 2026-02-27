import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "../types/activity";
import agent from "../api/agents";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

export const useActivities = (id?: string) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();

  const { data: Activities, isLoading } = useQuery({
    queryKey: ["Activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities" && !!currentUser,
    select: (data) => {
      return data.map((activity) => {
        const host = activity.attendees?.find((x) => x.id === activity.hostId);
        return {
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isGoing: activity.attendees?.some((x) => x.id === currentUser?.id),
          hostImage: host?.imageUrl,
        };
      });
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id && !!currentUser,
    select: (data) => {
      const host = data.attendees?.find((x) => x.id === data.hostId);

      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees?.some((x) => x.id === currentUser?.id),
        hostImage: host?.imageUrl,
      };
    },
  });
  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put("/activities", activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Activities"],
      });
    },
  });
  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.post("/activities", activity);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Activities"],
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.delete(`/activities/${activity.id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Activities"],
      });
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      await agent.post(`/activities/${id}/attend`);
    },
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ["activity", activityId] });

      const prevActivity = queryClient.getQueryData<Activity>([
        "activity",
        activityId,
      ]);

      queryClient.setQueryData<Activity>(
        ["activity", activityId],
        (oldActivity) => {
          if (!oldActivity || !currentUser) {
            return oldActivity;
          }
          const isHost = oldActivity.hostId === currentUser.id;
          const isAttending = oldActivity.attendees?.some(
            (x) => x.id === currentUser.id,
          );
          return {
            ...oldActivity,
            isCancelled: isHost
              ? !oldActivity.isCancelled
              : oldActivity.isCancelled,
            attendees: isAttending
              ? isHost
                ? oldActivity.attendees
                : oldActivity.attendees!.filter((x) => x.id !== currentUser.id)
              : [
                  ...oldActivity.attendees!,
                  {
                    id: currentUser.id,
                    displayName: currentUser.displayName,
                    imageUrl: currentUser.imageUrl,
                  },
                ],
          };
        },
      );
      return { prevActivity };
    },
    onError: (error, activityId, context) => {
      console.log(error);
      if (context?.prevActivity) {
        queryClient.setQueryData<Activity>(
          ["activity", activityId],
          context.prevActivity,
        );
      }
    },
  });

  return {
    Activities,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance,
  };
};
