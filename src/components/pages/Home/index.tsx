import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Check } from "lucide-react";
import { Banks } from "@/types";
import { DragAndDrop } from "@/components/molecules";
import { LoadingButton } from "@/components/atoms";

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
    Object.values(Banks)[0]
  );

  const handleBankChange = (value: Banks) => {
    setSelectedBank(value);
  };

  const handleUpload = () => {
    setIsUploading(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
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

          <p className="text-sm text-muted-foreground mt-2">
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
