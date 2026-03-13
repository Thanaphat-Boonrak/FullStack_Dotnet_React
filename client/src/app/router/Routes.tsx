import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import HomePage from "../features/home/HomePage";
import ActivityDetailsPage from "../features/activities/details/ActivityDetailsPage";
import NotFound from "../features/error/NotFound";
import ServerError from "../features/error/ServerError";
import RequireAuth from "./RequireAuth";
import LoginForm from "../features/account/LoginForm";
import RegisterForm from "../features/account/registerForm";
import ProfilePage from "../features/profiles/ProfilePage";
import VerifyEmail from "../features/account/VerifyEmail";
import ChangePasswordForm from "../features/account/ChangePasswordForm";
import ForgetPassword from "../features/account/ForgetPassword";
import ResetPasswordForm from "../features/account/ResetPasswordForm";
import AuthCallback from "../features/account/AuthCallback";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetailsPage /> },
          { path: "createActivity", element: <ActivityForm key={"create"} /> },
          { path: "manage/:id", element: <ActivityForm /> },
          { path: "profiles/:id", element: <ProfilePage /> },
          {
            path: "change-password",
            element: <ChangePasswordForm />,
          },
        ],
      },
      { path: "confirm-email", element: <VerifyEmail></VerifyEmail> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPasswordForm /> },

      { path: "", element: <HomePage /> },
      { path: "register", element: <RegisterForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "auth-callback", element: <AuthCallback></AuthCallback> },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerError /> },

      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);
