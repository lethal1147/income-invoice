import {
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  PieLabel,
  Tooltip,
} from "recharts";
import { COLORS, RADIAN } from "../constant";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartConfig } from "@/configs/chartConfig";

type SpendingPieChartPropsType = {
  data: { [key: string]: number };
};

type Transaction = {
  name: string;
  value: number;
  percentage: string;
};

const customDonutLabel: PieLabel = (props) => {
  const slicePercentage = props.payload.value * 100;
  if (slicePercentage < 10) {
    return null;
  }
  const innerRadius = +props.innerRadius;
  const outerRadius = +props.outerRadius;
  const cx = +props.cx;
  const cy = +props.cy;
  const midAngle = +props.midAngle;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;

  return (
    <text
      style={{ fontWeight: "semibold", fontSize: "md" }}
      x={cx + radius * Math.cos(-midAngle * RADIAN)}
      y={cy + radius * Math.sin(-midAngle * RADIAN)}
      fill={props.payload.color}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {props.name} : {props.percentage}%
    </text>
  );
};

function generateColor(index: number): string {
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

const prepareDataForChart = (data: { [key: string]: number }) => {
  const totalSpending = Object.values(data).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const top5 = sortedEntries.slice(0, 4);
  const others = sortedEntries
    .slice(5)
    .reduce((acc, [, value]) => acc + value, 0);

  const chartData = top5.map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalSpending) * 100).toFixed(2), // Calculate percentage
  }));

  if (others > 0) {
    chartData.push({
      name: "Others",
      value: others,
      percentage: ((others / totalSpending) * 100).toFixed(2), // Percentage for "Others"
    });
  }

  return chartData;
};

function transformData(transactions: Transaction[]) {
  const config: Record<string, { label: string; color: string }> = {};
  const chartData = transactions.map((transaction, index) => {
    const color = generateColor(index);
    config[transaction.name] = {
      label: transaction.name,
      color: color,
    };
    return {
      ...transaction,
      fill: color,
    };
  });

  return { config, chartData };
}

export default function SpendingPieChart({ data }: SpendingPieChartPropsType) {
  const preparedData = prepareDataForChart(data);
  const { config, chartData } = transformData(preparedData);
  return (
    <ChartContainer className="mx-auto size-full" config={config}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cy="50%"
          cx="50%"
          outerRadius={250}
          label={customDonutLabel}
          labelLine={false}
        >
          <LabelList
            dataKey="value"
            className="fill-background "
            stroke="black"
            fontSize={20}
            formatter={(value: keyof typeof chartConfig) =>
              chartConfig[value]?.label
            }
          />
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
