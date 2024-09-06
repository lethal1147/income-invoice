import { ChartConfig } from "@/components/ui/chart";

export const summaryChartConfig = {
  income: {
    label: "Income",
    color: "#16A34A",
  },
  expense: {
    label: "Expense",
    color: "#c30010",
  },
} satisfies ChartConfig;

export const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;
