import z from "zod";
import { requireString } from "../utils/utils";

export const resetPasswordSchema = z
  .object({
    newPassword: requireString("New Password"),
    confirmPassword: requireString("Confirm Password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
