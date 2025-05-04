import { read, utils } from "xlsx";
import { nanoid } from "nanoid";
import { Expense } from "../../types";

export function nubankSheetReader(file: File): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = utils.sheet_to_json(sheet, {
          header: ["date", "description", "amount"],
          range: 1,
        });

        const expenses: Expense[] = (rows as any[])
          .filter((row) => {
            const amount = parseFloat(row.amount);
            return !isNaN(amount) && amount >= 0;
          })
          .map((row) => ({
            id: nanoid(),
            date: new Date(row.date),
            description: String(row.description),
            amount: parseFloat(row.amount),
            category: undefined,
            identifier: undefined,
            monthlyRecurring: false,
          }));

        resolve(expenses);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}
