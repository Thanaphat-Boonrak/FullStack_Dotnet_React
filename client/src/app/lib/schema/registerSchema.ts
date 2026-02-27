import { z } from "zod";
import { requireString } from "../utils/utils";

export const registerSchema = z.object({
  email: z.email(),
  displayName: requireString("displayName"),
  password: requireString("password"),
});

export type RegisterSchema = z.input<typeof registerSchema>;
