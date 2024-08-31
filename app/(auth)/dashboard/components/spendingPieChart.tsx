import { Cell, Legend, Pie, PieChart, PieLabel, Tooltip } from "recharts";
import { COLORS, RADIAN } from "../constant";

type SpendingPieChartPropsType = {
  data: { [key: string]: number };
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

export default function SpendingPieChart({ data }: SpendingPieChartPropsType) {
  const chartData = prepareDataForChart(data);
  return (
    <PieChart width={550} height={500}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        label={customDonutLabel}
        labelLine={false}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value: number) => `$${value}`} />
      <Legend />
    </PieChart>
  );
}
