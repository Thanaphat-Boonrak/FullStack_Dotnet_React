import { useLocalObservable } from "mobx-react-lite";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import type { ChatComment } from "../types/activity";
import { runInAction } from "mobx";
export const useComment = (activityId?: string) => {
  const create = useRef(false);
  const commentStore = useLocalObservable(() => ({
    hubConnection: null as HubConnection | null,
    comments: [] as ChatComment[],

    createHubConnection(activityId: string) {
      if (!activityId) return;

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_COMMENT_URL}?activityId=${activityId}`,
          {
            withCredentials: true,
          },
        )
        .withAutomaticReconnect()
        .build();

      this.hubConnection
        .start()
        .catch((err) => console.log("Error Conection : ", err));

      this.hubConnection.on("LoadComments", (comments) => {
        runInAction(() => {
          this.comments = comments;
        });
      });

      this.hubConnection.on("ReceiveComment", (comment) => {
        console.log("RAW FROM SIGNALR:", comment);
        console.log("keys:", Object.keys(comment));
        console.log("createdAt:", comment.createdAt);
        runInAction(() => {
          this.comments.unshift(comment);
        });
      });
    },

    stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection
          .stop()
          .catch((err) => console.log("Error Connection : ", err));
      }
    },
  }));

  useEffect(() => {
    if (activityId && !create.current) {
      commentStore.createHubConnection(activityId);
      create.current = true;
    }
    return () => {
      commentStore.stopHubConnection();
      commentStore.comments = [];
    };
  }, [activityId, commentStore]);

  return {
    commentStore,
  };
};
