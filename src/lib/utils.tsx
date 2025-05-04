import { Expense } from "@/types";
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
  expense: Expense
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
