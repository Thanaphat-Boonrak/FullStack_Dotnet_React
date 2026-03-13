import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Activity, PagedList } from "../types/activity";
import agent from "../api/agents";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";

export const useActivities = (id?: string) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();

  const {
    activityStore: { filter, startDate },
  } = useStore();

  const {
    data: activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PagedList<Activity, string>>({
    queryKey: ["Activities", filter, startDate],
    queryFn: async ({ pageParam = null }) => {
      const response = await agent.get<PagedList<Activity, string>>(
        "/activities",
        {
          params: {
            cursor: pageParam,
            pageSize: 3,
            filter,
            startDate,
          },
        },
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    initialPageParam: null,
    getNextPageParam: (LastPage) => LastPage.nextCursor,
    enabled: !id && location.pathname === "/activities" && !!currentUser,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map((activity) => {
          const host = activity.attendees?.find(
            (x) => x.id === activity.hostId,
          );
          return {
            ...activity,
            isHost: currentUser?.id === activity.hostId,
            isGoing: activity.attendees?.some((x) => x.id === currentUser?.id),
            hostImage: host?.imageUrl,
          };
        }),
      })),
    }),
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
      await agent.put(`/activities/${activity.id}`, activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["Activities", activity?.id],
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
    mutationFn: async () => {
      await agent.post(`/activities/${id}/attend`);
    },
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ["activity", activityId] });
      await queryClient.invalidateQueries({
        queryKey: ["Activities"],
      });
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
    activitiesGroup,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};
