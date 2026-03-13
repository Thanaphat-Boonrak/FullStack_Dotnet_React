import z from "zod";
import { requireString } from "../utils/utils";

export const changePasswordSchema = z
  .object({
    currentPassword: requireString("Current Password"),
    newPassword: requireString("New Password"),
    confirmPassword: requireString("Confirm Password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
