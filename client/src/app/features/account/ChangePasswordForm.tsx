import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "../../lib/schema/changePassword";
import { useAccount } from "../../lib/hooks/useAccount";
import AccountWrapperForm from "./AccountWrapperForm";
import { Password } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../shared/components/TextInput";
import { toast } from "react-toastify";

export default function ChangePasswordForm() {
  const { changePassword } = useAccount();
  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      await changePassword.mutateAsync(data, {
        onSuccess: () => {
          toast.success("Password has been change");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AccountWrapperForm<ChangePasswordSchema>
      title="Change Password"
      icon={<Password fontSize="large"></Password>}
      onSubmit={onSubmit}
      resolver={zodResolver(changePasswordSchema)}
      defaultValues={{
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      }}
      submitButtonText="Change Password"
      reset={true}
    >
      <TextInput
        type="password"
        label="Current password"
        name="currentPassword"
      ></TextInput>
      <TextInput
        type="password"
        label="New password"
        name="newPassword"
      ></TextInput>
      <TextInput
        type="password"
        label="Confirm password"
        name="confirmPassword"
      ></TextInput>
    </AccountWrapperForm>
  );
}
