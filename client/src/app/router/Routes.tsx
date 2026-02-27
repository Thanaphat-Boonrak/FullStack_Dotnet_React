import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import HomePage from "../features/home/HomePage";
import ActivityDetailsPage from "../features/activities/details/ActivityDetailsPage";
import TestErrors from "../features/error/testError";
import NotFound from "../features/error/NotFound";
import ServerError from "../features/error/ServerError";
import RequireAuth from "./RequireAuth";
import LoginForm from "../features/account/LoginForm";
import RegisterForm from "../features/account/registerForm";
import ProfilePage from "../features/profiles/ProfilePage";

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
        ],
      },
      { path: "", element: <HomePage /> },
      { path: "register", element: <RegisterForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "error", element: <TestErrors /> },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerError /> },
    ],
  },
]);
