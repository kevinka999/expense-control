import { readers } from "@/lib/readers";
import { Banks, Expense } from "@/types";
import React from "react";

type ExpenseContextType = {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  readExpenses: (bank: Banks, file: File) => Promise<Expense[]>;
};

export const ExpenseContext = React.createContext<
  ExpenseContextType | undefined
>(undefined);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const handleSetExpenses = (expenses: Expense[]) => {
    setExpenses(expenses);
  };

  const handleReadExpenses = async (bank: Banks, file: File) => {
    const reader = readers[bank];
    if (!reader) throw new Error(`Reader for ${bank} not defined`);

    return await reader(file);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses: handleSetExpenses,
        readExpenses: handleReadExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = React.useContext(ExpenseContext);
  if (!context) {
    throw new Error("ExpenseContext is not defined");
  }
  return context;
};
