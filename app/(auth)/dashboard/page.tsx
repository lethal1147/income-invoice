"use client";

import NavMenu from "@/components/sidebar/navMenu";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  HandCoins,
  Import,
  Wallet,
} from "lucide-react";
import SummaryCard from "./components/summaryCard";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CurrentFilterStateType } from "@/types/utilsType";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { summaryChartConfig } from "@/configs/chartConfig";
import SpendingPieChart from "./components/spendingPieChart";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import { useSession } from "next-auth/react";
import Loader from "@/components/common/loader";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { DatePickerWithRange } from "@/components/ui/datePickerRange";
import useWalletStore from "@/stores/walletStore";
import useDashboardStore from "@/stores/dashboardStore";
import { handleError } from "@/utils/utils";

dayjs.extend(quarterOfYear);

export default function Dashboard() {
  const {
    currentFilter,
    dateFilter,
    expenseSummaryData,
    expenseTagSummary,
    summary,
    year,
    fetchExpenseData,
    fetchExpenseSummaryOfTag,
    onChangeFilter,
    increaseYear,
    setCurrentFilter,
    updateDateFilter,
  } = useDashboardStore();

  const { isPending, setStatus } = useStatus(apiStatus.PENDING);
  const { isPending: isPendingTag, setStatus: setStatusTag } = useStatus(
    apiStatus.PENDING
  );
  const { data: session } = useSession();
  const { wallet } = useWalletStore();

  useEffect(() => {
    const fetcher = async () => {
      if (!session?.user?.id) return;
      try {
        setStatus(apiStatus.PENDING);
        await fetchExpenseData(session?.user?.id);
        setStatus(apiStatus.SUCCESS);
      } catch (err) {
        handleError(err);
        setStatus(apiStatus.ERROR);
      }
    };
    fetcher();
  }, [session?.user?.id, year]);

  useEffect(() => {
    const fetcher = async () => {
      if (!session?.user?.id) return;
      try {
        setStatusTag(apiStatus.PENDING);
        await fetchExpenseSummaryOfTag(session?.user?.id);
        setStatusTag(apiStatus.SUCCESS);
      } catch (err) {
        handleError(err);
        setStatusTag(apiStatus.ERROR);
      }
    };
    fetcher();
  }, [session?.user?.id, dateFilter.from, dateFilter.to]);

  return (
    <main className="flex">
      <NavMenu />
      <section className="loginBackGround p-10 gap-10 flex flex-col w-full">
        <div className="bg-white border p-8 rounded-md gap-10 flex flex-col size-full shadow-lg">
          <div className="flex justify-between ">
            <div className="flex justify-between h-24 w-full">
              <div className="flex gap-5">
                <SummaryCard
                  title="Balance"
                  value={wallet?.balance ? +wallet?.balance : 0}
                  icon={<Wallet size={25} />}
                />
                <SummaryCard
                  title="Total Earn"
                  value={summary.totalIncome}
                  icon={<HandCoins size={25} />}
                />
                <SummaryCard
                  title="Total Spend"
                  value={summary.totalExpense}
                  icon={<CircleDollarSign size={25} />}
                />
                <SummaryCard
                  title="Total Save"
                  value={summary.totalSave}
                  icon={<Import size={25} />}
                />
              </div>

              <div className="grid grid-rows-2">
                <div className=" row-span-1 bg-gray-200 flex self-start gap-1 rounded-xl h-auto p-1">
                  <div
                    className={cn("current-state-filter", {
                      "bg-green-main text-white": currentFilter === "month",
                    })}
                    onClick={() => onChangeFilter("month")}
                    role="button"
                  >
                    This month
                  </div>
                  <div
                    className={cn("current-state-filter", {
                      "bg-green-main text-white": currentFilter === "quarter",
                    })}
                    onClick={() => onChangeFilter("quarter")}
                    role="button"
                  >
                    This Quarter
                  </div>
                  <div
                    className={cn("current-state-filter", {
                      "bg-green-main text-white ": currentFilter === "year",
                    })}
                    onClick={() => onChangeFilter("year")}
                    role="button"
                  >
                    This Year
                  </div>
                  <div
                    className={cn("current-state-filter", {
                      "bg-green-main text-white": currentFilter === "custom",
                    })}
                    onClick={() => setCurrentFilter("custom")}
                    role="button"
                  >
                    Custom
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  {currentFilter === "custom" ? (
                    <DatePickerWithRange
                      value={dateFilter}
                      onSelect={(range: { from: Date; to: Date }) =>
                        updateDateFilter({ from: range?.from, to: range?.to })
                      }
                    />
                  ) : (
                    <div className="flex items-end justify-end gap-2">
                      <Clock />
                      <h2 className=" row-span-1 font-bold">
                        {dayjs(dateFilter.from).format("DD/MM/YYYY")} -{" "}
                        {dayjs(dateFilter.to).format("DD/MM/YYYY")}
                      </h2>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border md:min-w-full"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex flex-col h-full">
                <span className="flex w-full justify-between items-center">
                  <h2 className="text-xl font-bold p-5">Overview this year</h2>
                  <div className="flex gap-3">
                    <div
                      className="hover:bg-gray-200 rounded-full cursor-pointer"
                      onClick={() => increaseYear("decrease")}
                    >
                      <ChevronLeft />
                    </div>
                    <p>{year}</p>
                    <div
                      className="hover:bg-gray-200 rounded-full cursor-pointer"
                      onClick={() => increaseYear("increase")}
                    >
                      <ChevronRight />
                    </div>
                  </div>
                </span>
                {isPending ? (
                  <div className="size-full flex justify-center items-center">
                    <Loader />
                  </div>
                ) : (
                  <ChartContainer
                    config={summaryChartConfig}
                    className="min-h-[200px] w-full"
                  >
                    <BarChart accessibilityLayer data={expenseSummaryData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="expense" fill="#c30010" />
                      <Bar dataKey="income" fill="#16A34A" />
                    </BarChart>
                  </ChartContainer>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex flex-col items-center h-full">
                <h2 className=" self-start text-xl font-bold px-5 pt-5">
                  Total spend on
                </h2>
                {isPendingTag ? (
                  <div className="size-full flex justify-center items-center">
                    <Loader />
                  </div>
                ) : (
                  <SpendingPieChart data={expenseTagSummary} />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>
    </main>
  );
}
