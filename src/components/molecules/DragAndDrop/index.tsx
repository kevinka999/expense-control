import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileSpreadsheet, Upload, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type State = "idle" | "dragging" | "error";

type DragAndDropProps = {
  file: File | null;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (file: File) => void;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  extensions: string[];
};

export const DragAndDrop = ({
  file,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemove,
  extensions,
}: DragAndDropProps) => {
  const [localFile, setLocalFile] = React.useState<File | null>(file);
  const [state, setState] = React.useState<State>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    return fileExtension && extensions.includes(fileExtension);
  };

  const handleRemoveFile = () => {
    setLocalFile(null);
    setErrorMessage("");
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (selectedFile: File) => {
    const isValid = validateFile(selectedFile);
    if (isValid) {
      setLocalFile(selectedFile);
      setErrorMessage("");
      onFileChange(selectedFile);
      return;
    }

    setErrorMessage("This file type is not supported");
    setState("error");
    setLocalFile(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState("dragging");
    onDragOver?.(e);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState("idle");
    onDragLeave?.(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState("idle");

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
      onDrop?.(droppedFile);
    }
  };

  const classes = twMerge(
    "border-2 border-dashed rounded-lg p-8 text-center",
    state === "idle" && "border-muted-foreground/20",
    state === "dragging" && "border-primary bg-primary/5",
    state === "error" && "border-destructive bg-destructive/5",
    localFile && "bg-muted/10"
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className={classes}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!localFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted/30 p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Drag and drop your file here
              </h3>
              <p className="text-sm text-muted-foreground">
                or{" "}
                <span className="text-primary cursor-pointer">
                  browse files
                </span>{" "}
                from your computer
              </p>
              <p className="text-xs text-muted-foreground">
                Supports types: {extensions.join(", ")}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={extensions.join(",")}
              className="hidden"
              onChange={handleFileInputChange}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              size="sm"
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-muted/30 p-3">
                <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-medium">{localFile.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {(localFile.size / 1024).toFixed(2)} KB ·{" "}
                  {new Date(localFile.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-2 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
