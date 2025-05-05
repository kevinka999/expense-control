import React from "react";
import { formatCurrency, getCategoryHexColorByName } from "@/lib/utils";
import { ChartData } from "@/types";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  data: ChartData[];
};

export const PieChart = ({ data }: PieChartProps) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = React.useState(300);

  React.useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const width = chartRef.current.offsetWidth;
        setChartHeight(Math.max(300, Math.min(width * 0.7, 400)));
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No data available for chart
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) =>
          getCategoryHexColorByName(item.color),
        ),
        borderColor: data.map(() => "#ffffff"),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      ref={chartRef}
      style={{ height: `${chartHeight}px` }}
      className="relative"
    >
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 15,
                padding: 15,
                generateLabels: (chart: any) => {
                  const datasets = chart.data.datasets;
                  return (
                    chart.data.labels?.map((label: any, i: any) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
                      const value = datasets[0].data[i] as number;
                      const percentage = (
                        (value /
                          data.reduce((sum, item) => sum + item.value, 0)) *
                        100
                      ).toFixed(1);

                      return {
                        text: `${label} - ${formatCurrency(value)} (${percentage}%)`,
                        fillStyle: style.backgroundColor as string,
                        strokeStyle: style.borderColor as string,
                        lineWidth: style.borderWidth as number,
                        hidden: false,
                        index: i,
                      };
                    }) || []
                  );
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const value = context.raw as number;
                  const total = data.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
