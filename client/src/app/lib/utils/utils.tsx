import { format, formatDistanceToNow, type DateArg } from "date-fns";
import { z } from "zod";
export function dateFormat(date: DateArg<Date>) {
  return format(date, "dd MMM yyyy h:mm a");
}

export function timeAgo(date: DateArg<Date>) {
  return formatDistanceToNow(date) + ", ago";
}

export const requireString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);
