import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category, Expense } from "@/types";
import {
  formatCurrency,
  getCategoryColorById,
  getCategoryColorByValue,
  getCategoryNameById,
  getStatusIndicator,
  statusIndicatorMap,
} from "@/lib/utils";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

type ExpenseTableProps = {
  expenses: Expense[];
  categories: Category[];
  setExpenses: (expenses: Expense[]) => void;
};

export const ExpenseTable = ({
  expenses,
  setExpenses,
  categories,
}: ExpenseTableProps) => {
  const updateCategory = (expenseId: string, categoryId: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === expenseId ? { ...expense, category: categoryId } : expense,
    );

    setExpenses(updatedExpenses);
  };

  const updateIdentifier = (expenseId: string, identifier: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === expenseId ? { ...expense, identifier } : expense,
    );

    setExpenses(updatedExpenses);
  };

  const toggleMonthlyRecurring = (expenseId: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === expenseId
        ? { ...expense, monthlyRecurring: !expense.monthlyRecurring }
        : expense,
    );

    setExpenses(updatedExpenses);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="w-[25%]">Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="w-[20%]">Category</TableHead>
            <TableHead className="w-[15%]">Identifier</TableHead>
            <TableHead className="w-[5%]">Status</TableHead>
            <TableHead className="w-[5%]">Monthly</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground py-6 text-center"
              >
                No expenses found
              </TableCell>
            </TableRow>
          )}

          {expenses.length > 0 &&
            expenses.map((expense) => {
              const categoryName = getCategoryNameById(expense.category || "");
              const categoryColor = getCategoryColorById(
                expense.category || "",
              );

              const status = getStatusIndicator(expense);
              const statusObject = status
                ? statusIndicatorMap[status]
                : undefined;

              return (
                <TableRow key={expense.id}>
                  <TableCell>
                    {dayjs(expense.date).format("DD/MM/YYYY")}
                  </TableCell>
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
                                className={`bg-${categoryColor}-100 text-${categoryColor}-800 border-${categoryColor}-200`}
                              >
                                {categoryName}
                              </Badge>
                            </div>
                          ) : (
                            "Select category"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          const categoryColor = getCategoryColorByValue(
                            category.color,
                          );

                          return (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`bg-${categoryColor}-100 text-${categoryColor}-800 border-${categoryColor}-200`}
                                >
                                  {category.name}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
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
                    {statusObject && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipContent>
                            <statusObject.Icon
                              className={`h-4 w-4 ${statusObject.color}`}
                            />
                            <span>{statusObject.text}</span>
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
                                  ? "border-blue-500 text-blue-500"
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
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};
