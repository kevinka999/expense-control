import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Banks } from "@/types";
import { DragAndDrop } from "@/components/molecules";
import { LoadingButton } from "@/components/atoms";
import { useExpenseContext } from "@/context/ExpenseContext";
import { useNavigate } from "react-router";

type BankInformation = {
  name: string;
  color: string;
};

const banksInformationMap: Record<Banks, BankInformation> = {
  [Banks.NUBANK]: {
    name: "Nubank",
    color: "purple",
  },
};

export const Home = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [selectedBank, setSelectedBank] = React.useState<Banks>(
    Object.values(Banks)[0],
  );

  const { readExpenses, setExpenses } = useExpenseContext();
  const navigate = useNavigate();

  const handleBankChange = (value: Banks) => {
    setSelectedBank(value);
  };

  const handleUpload = async () => {
    if (!file) throw new Error("File is required");

    setIsUploading(true);
    readExpenses(selectedBank, file)
      .then((expenses) => {
        setExpenses(expenses);
        navigate("/report");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="md:w-3/4 lg:w-2/3 xl:w-1/2">
        <CardHeader>
          <CardTitle>Upload sheet report</CardTitle>
          <CardDescription>
            Upload your sheet report in XLSX format. We'll read the data and
            extract the information to help you manage your expenses.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className="text-sm font-medium">Bank</label>
          <Select value={selectedBank} onValueChange={handleBankChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>

            <SelectContent>
              {Object.values(Banks).map((bank) => (
                <SelectItem key={bank} value={bank}>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`bg-${banksInformationMap[bank].color}-100 text-${banksInformationMap[bank].color}-800 border-${banksInformationMap[bank].color}-200`}
                    >
                      {banksInformationMap[bank].name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-muted-foreground mt-2 text-sm">
            Select the bank to find out which table model is used for data
            extraction.
          </p>

          <div className="mt-4">
            <DragAndDrop
              file={file}
              onFileChange={setFile}
              onRemove={() => setFile(null)}
              extensions={["csv", "xlsx", "xls"]}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <LoadingButton isLoading={isUploading} onClick={handleUpload}>
            Upload sheet
          </LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
};
