import { formatCurrencyThaiBath } from "@/utils/formatter";
import React, { ReactNode } from "react";

type SummaryCardPropType = {
  value: number;
  title: string;
  icon: ReactNode;
};

export default function SummaryCard({
  value,
  title,
  icon,
}: SummaryCardPropType) {
  return (
    <div className="flex border rounded-md p-3 gap-3 relative min-w-52">
      <div className="flex flex-col justify-between gap-3">
        <h2 className="font-bold text-xl text-gray-800">{title}</h2>
        <h3
          className={`${
            title === "Total Spend" || value < 0
              ? "text-red-500"
              : "text-green-600"
          } font-bold`}
        >
          {formatCurrencyThaiBath(value)}
        </h3>
      </div>
      <div className=" absolute bottom-8 right-6">{icon}</div>
    </div>
  );
}
