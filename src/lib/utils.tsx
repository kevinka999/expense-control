import { ChartData, Expense } from "@/types";
import { categories } from "@/mock";
import { AlertCircle, RepeatIcon } from "lucide-react";
import { StatusIndicator } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2 } from "lucide-react";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const getCategoryHexColorByName = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "#10b981",
    blue: "#3b82f6",
    orange: "#f97316",
    purple: "#a855f7",
    pink: "#ec4899",
    red: "#ef4444",
    yellow: "#eab308",
    teal: "#14b8a6",
    indigo: "#6366f1",
    cyan: "#06b6d4",
    gray: "#6b7280",
  };
  return colorMap[color] || colorMap.gray;
};

export const getCategoryColorByValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    "#10b981": "green",
    "#3b82f6": "blue",
    "#f97316": "orange",
    "#a855f7": "purple",
    "#ec4899": "pink",
    "#ef4444": "red",
    "#eab308": "yellow",
    "#14b8a6": "teal",
    "#6366f1": "indigo",
    "#06b6d4": "cyan",
    "#6b7280": "gray",
  };
  return colorMap[color] || "gray";
};

export const getCategoryNameById = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.name || "Undefined";
};

export const getCategoryColorById = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return getCategoryColorByValue(category?.color || "");
};

type StatusIndicatorMap = {
  [key in StatusIndicator]: {
    Icon: React.ComponentType<any>;
    color: string;
    text: string;
  };
};

export const getStatusIndicator = (
  expense: Expense,
): StatusIndicator | undefined => {
  if (expense.monthlyRecurring) {
    return StatusIndicator.Monthly;
  }

  if (expense.identifier) {
    return StatusIndicator.Matched;
  }

  if (!expense.category) {
    return StatusIndicator.NeedsVerification;
  }

  return undefined;
};

export const statusIndicatorMap: StatusIndicatorMap = {
  [StatusIndicator.Matched]: {
    Icon: CheckCircle2,
    color: "text-green-500",
    text: "Matched",
  },
  [StatusIndicator.NeedsVerification]: {
    Icon: AlertCircle,
    color: "text-amber-500",
    text: "Needs verification",
  },
  [StatusIndicator.Monthly]: {
    Icon: RepeatIcon,
    color: "text-blue-500",
    text: "Monthly",
  },
};

export const parseExpenseToChartData = (expenses: Expense[]): ChartData[] => {
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const expensesByCategory = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      const categoryId = expense.category || "uncategorized";
      acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
      return acc;
    },
    {},
  );

  const categoriesWithUncategorized = [
    ...categories,
    {
      id: "uncategorized",
      name: "Uncategorized",
      color: "#6b7280",
    },
  ];

  const chartData = categoriesWithUncategorized.map((category) => {
    const categoryId = category.id;
    const value = expensesByCategory[categoryId] || 0;

    return {
      id: categoryId,
      name: category?.name || "Unknown",
      color: getCategoryColorByValue(category?.color || "#6b7280"),
      value,
      percentage: (value / totalAmount) * 100,
    };
  });

  return chartData;
};
