import { Banks, Expense } from "@/types";
import { nubankSheetReader } from "./nubank-sheet-reader";

export const readers: Record<Banks, (file: File) => Promise<Expense[]>> = {
  [Banks.NUBANK]: nubankSheetReader,
};
