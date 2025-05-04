import { RouterProvider } from "react-router";
import { router } from "./router";
import { ExpenseProvider } from "./context/ExpenseContext";

export const App = () => {
  return (
    <main className="p-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </main>
  );
};
