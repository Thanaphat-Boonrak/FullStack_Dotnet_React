import { useNavigate } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import AccountWrapperForm from "./AccountWrapperForm";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../shared/components/TextInput";

export default function ForgetPassword() {
  const { forgetPassword } = useAccount();
  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    try {
      await forgetPassword.mutateAsync(data.email, {
        onSuccess: () => {
          toast.success("Password reset requested - please check your email");
          navigate("/login");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AccountWrapperForm
      title="Please enter your email address"
      icon={<LockOpen fontSize="large"></LockOpen>}
      onSubmit={onSubmit}
      submitButtonText="Request password reset link"
    >
      <TextInput
        rules={{ required: true }}
        name="email"
        label="Email address"
      ></TextInput>
    </AccountWrapperForm>
  );
}
