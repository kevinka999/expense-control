import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ChartData } from "@/types";

type ColumnChartProps = {
  data: ChartData[];
};

export const ColumnChart = ({ data }: ColumnChartProps) => {
  return (
    <div className="flex flex-col gap-4">
      {data.map((entry) => (
        <div key={entry.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`bg-${entry.color}-100 text-${entry.color}-800 border-${entry.color}-200`}
            >
              {entry.name}
            </Badge>
            <span className="text-sm font-medium">
              {formatCurrency(entry.value)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`bg-${entry.color}-500 h-2 rounded-full`}
              style={{ width: `${entry.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
