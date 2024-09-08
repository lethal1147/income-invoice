import { OptionType } from "@/types/utilsType";
import dayjs from "dayjs";

export function formatErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  } else {
    return "An unexpected error occurred";
  }
}

export function formatDateDefault(date: Date | string): string {
  return dayjs(new Date(date)).format("MM/DD/YYYY");
}

export function formatCurrencyDollar(number: string | number) {
  const currentFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return currentFormat.format(+number);
}

export function formatCurrencyThaiBath(number: string | number) {
  const currentFormat = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  });
  return currentFormat.format(+number);
}

export function formatOptionDropdown<T>(
  arr: T[],
  keyLabel: keyof T,
  keyValue: keyof T
): OptionType[] {
  return arr.map((opt) => ({
    value: opt[keyValue] as string | number,
    label: opt[keyLabel] as string,
  }));
}
