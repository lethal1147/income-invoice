export type OptionType = {
  label: string;
  value: string | number;
};

export type ApiStatusType = "IDLE" | "PENDING" | "ERROR" | "SUCCESS";

export type ApiStatusObjectType = {
  IDLE: "IDLE";
  PENDING: "PENDING";
  ERROR: "ERROR";
  SUCCESS: "SUCCESS";
};

export interface FilterQuery {
  page?: number;
  pageLimit?: number;
}

export type CurrentFilterStateType = "month" | "quarter" | "year" | "custom";
