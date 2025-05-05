export enum Banks {
  NUBANK = "Nubank",
}

export type Expense = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  identifier?: string;
  monthlyRecurring: boolean;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type CategoryExpense = Category & {
  total: number;
  percentage: number;
};

export enum StatusIndicator {
  Matched = "matched",
  NeedsVerification = "needs-verification",
  Monthly = "monthly",
}

export type ChartData = {
  id: string;
  name: string;
  color: string;
  value: number;
  percentage: number;
};
