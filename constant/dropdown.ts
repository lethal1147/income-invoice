import { OptionType } from "@/types/utilsType";

export const EXPENSE_TYPE_DROPDOWNS = [
  {
    label: "Expense",
    value: "e",
  },
  {
    label: "Income",
    value: "i",
  },
];

export const PAGINATION_OPTIONS: OptionType[] = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
];

export const THAILAND_BANKS = {
  bangkok: "ธนาคารกรุงเทพ",
  kasikorn: "ธนาคารกสิกรไทย",
  krungthai: "ธนาคารกรุงไทย",
  ttb: "ธนาคารทหารไทยธนชาต",
  krungsri: "ธนาคารกรุงศรีอยุธยา",
  scb: "ธนาคารไทยพาณิชย์",
  kiatnakin: "ธนาคารเกียรตินาคินภัทร",
  aomsin: "ธนาคารออมสิน",
};

export const THAILAND_BANKS_OPTIONS: OptionType[] = Object.entries(
  THAILAND_BANKS
).map(([key, value]: [string, string]) => ({ label: value, value: key }));
