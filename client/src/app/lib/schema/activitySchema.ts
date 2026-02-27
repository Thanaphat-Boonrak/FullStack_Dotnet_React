import { z } from "zod";

export const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Date & must be in future",
  }),

  location: z
    .object({
      venue: z.string().min(1, "Venue is required"),
      city: z.string().optional(),
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional()
    .refine((val) => val !== undefined, {
      message: "Location is required",
    }),
});

export type ActivityFormInput = z.input<typeof activitySchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
