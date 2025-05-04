import { RouterProvider } from "react-router";
import { router } from "./router";
import { ExpenseProvider } from "./context/ExpenseContext";

export const App = () => {
  return (
    <main className="p-4 w-full">
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </main>
  );
};
