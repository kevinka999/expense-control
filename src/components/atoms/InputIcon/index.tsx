import { Input } from "@/components/ui/input";

type InputIconProps = React.ComponentProps<typeof Input> & {
  Icon: React.ComponentType<any>;
};

export const InputIcon = ({ Icon, ...props }: InputIconProps) => {
  return (
    <div className="relative w-full md:w-64">
      <Icon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input {...props} />
    </div>
  );
};
