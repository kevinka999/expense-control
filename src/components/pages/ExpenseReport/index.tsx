import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  RepeatIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define our data types
interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string | null;
  identifier: string | null;
  matched: boolean; // Indicates if this expense was matched with a previous one
  matchConfidence?: "high" | "medium" | "low"; // Optional confidence level of the match
  monthlyRecurring: boolean; // Whether this expense recurs monthly
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// Sample data
const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "2023-11-01",
    description: "Grocery Store",
    amount: 78.52,
    category: "groceries",
    identifier: "GS-MONTHLY",
    matched: true,
    matchConfidence: "high",
    monthlyRecurring: true,
  },
  {
    id: "2",
    date: "2023-11-02",
    description: "Netflix Subscription",
    amount: 14.99,
    category: "entertainment",
    identifier: "NETFLIX-SUB",
    matched: true,
    matchConfidence: "high",
    monthlyRecurring: true,
  },
  {
    id: "3",
    date: "2023-11-03",
    description: "Gas Station",
    amount: 45.0,
    category: "transportation",
    identifier: null,
    matched: false,
    monthlyRecurring: false,
  },
  {
    id: "4",
    date: "2023-11-05",
    description: "Restaurant",
    amount: 65.3,
    category: "dining",
    identifier: null,
    matched: false,
    monthlyRecurring: false,
  },
  {
    id: "5",
    date: "2023-11-07",
    description: "Electric Bill",
    amount: 110.42,
    category: "utilities",
    identifier: "ELEC-MONTHLY",
    matched: true,
    matchConfidence: "high",
    monthlyRecurring: true,
  },
  {
    id: "6",
    date: "2023-11-08",
    description: "Clothing Store",
    amount: 89.99,
    category: "shopping",
    identifier: null,
    matched: false,
    monthlyRecurring: false,
  },
  {
    id: "7",
    date: "2023-11-10",
    description: "Pharmacy",
    amount: 32.5,
    category: null,
    identifier: null,
    matched: true,
    matchConfidence: "medium",
    monthlyRecurring: false,
  },
  {
    id: "8",
    date: "2023-11-12",
    description: "Movie Tickets",
    amount: 28.0,
    category: "entertainment",
    identifier: null,
    matched: false,
    monthlyRecurring: false,
  },
  {
    id: "9",
    date: "2023-11-15",
    description: "Rent Payment",
    amount: 1200.0,
    category: "housing",
    identifier: "RENT-MONTHLY",
    matched: true,
    matchConfidence: "high",
    monthlyRecurring: true,
  },
  {
    id: "10",
    date: "2023-11-18",
    description: "Coffee Shop",
    amount: 5.75,
    category: null,
    identifier: null,
    matched: true,
    matchConfidence: "low",
    monthlyRecurring: false,
  },
];

const categories: Category[] = [
  { id: "groceries", name: "Groceries", color: "green" },
  { id: "housing", name: "Housing", color: "blue" },
  { id: "transportation", name: "Transportation", color: "orange" },
  { id: "utilities", name: "Utilities", color: "purple" },
  { id: "entertainment", name: "Entertainment", color: "pink" },
  { id: "dining", name: "Dining Out", color: "red" },
  { id: "shopping", name: "Shopping", color: "yellow" },
  { id: "healthcare", name: "Healthcare", color: "teal" },
  { id: "education", name: "Education", color: "indigo" },
  { id: "travel", name: "Travel", color: "cyan" },
];

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Get the badge color based on category
const getCategoryColor = (categoryId: string | null): string => {
  if (!categoryId) return "gray";
  const category = categories.find((c) => c.id === categoryId);
  return category?.color || "gray";
};

// Get the category name based on ID
const getCategoryName = (categoryId: string | null): string => {
  if (!categoryId) return "Uncategorized";
  const category = categories.find((c) => c.id === categoryId);
  return category?.name || "Uncategorized";
};

// Get match confidence icon and color
const getMatchIndicator = (expense: Expense) => {
  if (!expense.matched) return null;

  switch (expense.matchConfidence) {
    case "high":
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: "High confidence match",
        color: "text-green-500",
      };
    case "medium":
      return {
        icon: <Info className="h-5 w-5 text-blue-500" />,
        text: "Medium confidence match",
        color: "text-blue-500",
      };
    case "low":
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        text: "Low confidence match - please verify",
        color: "text-amber-500",
      };
    default:
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: "Matched with previous expense",
        color: "text-green-500",
      };
  }
};

// Get CSS color value for a category
const getCategoryColorValue = (color: string): string => {
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

export default function ExpenseReport() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter expenses based on tab
  const getTabFilteredExpenses = (expenses: Expense[]) => {
    switch (activeTab) {
      case "recurring":
        return expenses.filter((e) => e.monthlyRecurring);
      case "non-recurring":
        return expenses.filter((e) => !e.monthlyRecurring);
      default:
        return expenses;
    }
  };

  const tabFilteredExpenses = getTabFilteredExpenses(filteredExpenses);

  // Calculate total amount for filtered expenses
  const totalAmount = tabFilteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Update category for an expense
  const updateCategory = (expenseId: string, categoryId: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === expenseId
          ? { ...expense, category: categoryId }
          : expense
      )
    );
  };

  // Update identifier for an expense
  const updateIdentifier = (expenseId: string, identifier: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === expenseId
          ? { ...expense, identifier: identifier || null }
          : expense
      )
    );
  };

  // Toggle match status (for demonstration purposes)
  const toggleMatchStatus = (expenseId: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              matched: !expense.matched,
              matchConfidence: !expense.matched ? "high" : undefined,
            }
          : expense
      )
    );
  };

  // Toggle monthly recurring status
  const toggleMonthlyRecurring = (expenseId: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              monthlyRecurring: !expense.monthlyRecurring,
            }
          : expense
      )
    );
  };

  // Get category distribution for the filtered expenses
  const getCategoryTotals = (expenses: Expense[]) => {
    return categories
      .map((category) => {
        const total = expenses
          .filter((expense) => expense.category === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0);

        // Only include categories with expenses
        if (total === 0) return null;

        return {
          ...category,
          total,
          percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0,
        };
      })
      .filter(
        (category): category is NonNullable<typeof category> =>
          category !== null
      );
  };

  const categoryTotals = getCategoryTotals(tabFilteredExpenses);

  // Add uncategorized if needed
  const getChartData = (
    expenses: Expense[],
    categoryTotals: ReturnType<typeof getCategoryTotals>
  ) => {
    const chartData = [...categoryTotals];
    const uncategorizedTotal = expenses
      .filter((e) => e.category === null)
      .reduce((sum, e) => sum + e.amount, 0);

    if (uncategorizedTotal > 0) {
      chartData.push({
        id: "uncategorized",
        name: "Uncategorized",
        color: "gray",
        total: uncategorizedTotal,
        percentage:
          totalAmount > 0 ? (uncategorizedTotal / totalAmount) * 100 : 0,
      });
    }

    return chartData;
  };

  const chartData = getChartData(tabFilteredExpenses, categoryTotals);

  // Custom active shape for pie chart
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 15}
          dy={8}
          textAnchor="middle"
          fill="#888"
          className="text-xs"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 15}
          dy={8}
          textAnchor="middle"
          fill="#333"
          className="text-lg font-medium"
        >
          {formatCurrency(value)}
        </text>
        <text
          x={cx}
          y={cy + 35}
          dy={8}
          textAnchor="middle"
          fill="#888"
          className="text-xs"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  // Custom legend
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: `${entry.color}20`,
              color: entry.color,
              cursor: "pointer",
              border:
                activeIndex === index
                  ? `1px solid ${entry.color}`
                  : "1px solid transparent",
            }}
            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="font-semibold">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="recurring">Monthly Recurring</TabsTrigger>
          <TabsTrigger value="non-recurring">Non-Recurring</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Expenses</span>
              <div className="flex items-center gap-4 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Matched</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Needs verification</span>
                </div>
                <div className="flex items-center gap-1">
                  <RepeatIcon className="h-4 w-4 text-blue-500" />
                  <span>Monthly</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[25%]">Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead className="w-[5%]">Status</TableHead>
                    <TableHead className="w-[5%]">Monthly</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabFilteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tabFilteredExpenses.map((expense) => (
                      <TableRow
                        key={expense.id}
                        className={expense.matched ? "bg-slate-50" : ""}
                      >
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          <Select
                            value={expense.category || ""}
                            onValueChange={(value) =>
                              updateCategory(expense.id, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {expense.category ? (
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`bg-${getCategoryColor(
                                        expense.category
                                      )}-100 text-${getCategoryColor(
                                        expense.category
                                      )}-800 border-${getCategoryColor(
                                        expense.category
                                      )}-200`}
                                    >
                                      {getCategoryName(expense.category)}
                                    </Badge>
                                  </div>
                                ) : (
                                  "Select category"
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`bg-${category.color}-100 text-${category.color}-800 border-${category.color}-200`}
                                    >
                                      {category.name}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Add identifier"
                            value={expense.identifier || ""}
                            onChange={(e) =>
                              updateIdentifier(expense.id, e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          {expense.matched && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="cursor-pointer"
                                    onClick={() =>
                                      toggleMatchStatus(expense.id)
                                    }
                                  >
                                    {getMatchIndicator(expense)?.icon}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p
                                    className={
                                      getMatchIndicator(expense)?.color
                                    }
                                  >
                                    {getMatchIndicator(expense)?.text}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Checkbox
                                    id={`monthly-${expense.id}`}
                                    checked={expense.monthlyRecurring}
                                    onCheckedChange={() =>
                                      toggleMonthlyRecurring(expense.id)
                                    }
                                    className={
                                      expense.monthlyRecurring
                                        ? "text-blue-500 border-blue-500"
                                        : ""
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {expense.monthlyRecurring
                                    ? "Monthly recurring expense"
                                    : "Not a recurring expense"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.length > 0 ? (
                categoryTotals.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className={`bg-${category.color}-100 text-${category.color}-800 border-${category.color}-200`}
                      >
                        {category.name}
                      </Badge>
                      <span className="text-sm font-medium">
                        {formatCurrency(category.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${category.color}-500 h-2 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No categories to display
                </div>
              )}

              {/* Show uncategorized expenses if any */}
              {tabFilteredExpenses.some((e) => e.category === null) && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-200"
                    >
                      Uncategorized
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        tabFilteredExpenses
                          .filter((e) => e.category === null)
                          .reduce((sum, e) => sum + e.amount, 0)
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width:
                          totalAmount > 0
                            ? `${
                                (tabFilteredExpenses
                                  .filter((e) => e.category === null)
                                  .reduce((sum, e) => sum + e.amount, 0) /
                                  totalAmount) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Improved pie chart */}
            {chartData.length > 0 ? (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium mb-2 text-center">
                  {activeTab === "recurring"
                    ? "Monthly Recurring Expenses"
                    : activeTab === "non-recurring"
                    ? "Non-Recurring Expenses"
                    : "Expense Distribution"}
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getCategoryColorValue(entry.color)}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Legend
                        content={renderCustomizedLegend}
                        verticalAlign="bottom"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t text-center text-muted-foreground py-4">
                No data to display for the chart
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
