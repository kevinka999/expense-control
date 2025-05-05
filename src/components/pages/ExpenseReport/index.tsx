import React from "react";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenseContext } from "@/context/ExpenseContext";
import { useNavigate } from "react-router";
import { Expense, StatusIndicator } from "@/types";
import {
  formatCurrency,
  parseExpenseToChartData,
  statusIndicatorMap,
} from "@/lib/utils";
import { ColumnChart, ExpenseTable, PieChart } from "@/components/organisms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/mock";
import { InputIcon } from "@/components/atoms";

enum FilterOptions {
  All = "all",
  Recurring = "recurring",
  NonRecurring = "non-recurring",
}

export const ExpenseReport = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<FilterOptions>(
    FilterOptions.All,
  );

  const { expenses, setExpenses } = useExpenseContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (expenses.length > 0) return;
    navigate("/");
  }, [expenses]);

  const getTabFilteredExpenses = (expenses: Expense[]) => {
    switch (activeTab) {
      case FilterOptions.Recurring:
        return expenses.filter((e) => e.monthlyRecurring);
      case FilterOptions.NonRecurring:
        return expenses.filter((e) => !e.monthlyRecurring);
      default:
        return expenses;
    }
  };

  const searchFilteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tabFilteredExpenses = getTabFilteredExpenses(searchFilteredExpenses);

  const totalAmount = tabFilteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const chartData = parseExpenseToChartData(tabFilteredExpenses);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <InputIcon
          Icon={Search}
          type="text"
          placeholder="Search expenses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm">Total:</span>
          <span className="font-semibold">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <Tabs
        defaultValue={FilterOptions.All}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FilterOptions)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={FilterOptions.All}>All Expenses</TabsTrigger>
          <TabsTrigger value={FilterOptions.Recurring}>
            Monthly Recurring
          </TabsTrigger>
          <TabsTrigger value={FilterOptions.NonRecurring}>
            Non-Recurring
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <ColumnChart data={chartData} />
            <PieChart data={chartData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Expenses</span>

            <div className="flex items-center gap-4 text-sm font-normal">
              {Object.values(StatusIndicator).map((status) => {
                const { Icon, color, text } = statusIndicatorMap[status];

                return (
                  <div className="flex items-center gap-1" key={status}>
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ExpenseTable
            categories={categories}
            expenses={tabFilteredExpenses}
            setExpenses={setExpenses}
          />
        </CardContent>
      </Card>
    </div>
  );
};
