import { z } from "zod";
import { requireString } from "../utils/utils";

export const editProfileSchema = z.object({
  displayName: requireString("Display Name"),
  bio: z.string().optional(),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
