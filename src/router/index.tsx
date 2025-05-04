import { createBrowserRouter } from "react-router";
import { Home, ExpenseReport } from "@/components/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/report",
    element: <ExpenseReport />,
  },
]);
