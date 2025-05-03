import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  isLoading: boolean;
};

export const LoadingButton = ({ isLoading, ...props }: LoadingButtonProps) => {
  return (
    <Button {...props}>
      {isLoading ? (
        <>
          <span className="animate-spin">
            <Upload className="h-4 w-4" />
          </span>
        </>
      ) : (
        props.children
      )}
    </Button>
  );
};
