import { useNavigate, useSearchParams } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../../lib/schema/resetPassword";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import AccountWrapperForm from "./AccountWrapperForm";
import TextInput from "../../shared/components/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const { resetPassword } = useAccount();
  const navigate = useNavigate();

  const email = params.get("email");
  const code = params.get("code");
  if (!email || !code)
    return <Typography>Invalid reset password code</Typography>;

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      await resetPassword.mutateAsync(
        {
          email,
          resetCode: code,
          newPassword: data.newPassword,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully - you can now sign in");
            navigate("/login");
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AccountWrapperForm<ResetPasswordSchema>
      title="Reset your Password"
      icon={<LockOpen fontSize="large"></LockOpen>}
      onSubmit={onSubmit}
      resolver={zodResolver(resetPasswordSchema)}
      submitButtonText={"Reset Password"}
    >
      <TextInput
        label="New Password"
        type="password"
        name="newPassword"
      ></TextInput>
      <TextInput
        label="New Password"
        type="password"
        name="confirmPassword"
      ></TextInput>
    </AccountWrapperForm>
  );
}
