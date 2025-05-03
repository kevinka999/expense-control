import { createBrowserRouter } from "react-router";
import { Home } from "@/components/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
