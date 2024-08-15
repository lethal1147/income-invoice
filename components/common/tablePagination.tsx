import { PAGINATION_OPTIONS } from "@/constant/dropdown";
import { OptionType } from "@/types/utilsType";
import { ChangeEvent, MouseEvent } from "react";

type TablePaginationType = {
  page: number;
  pageLimit: number;
  totalDocs: number;
  handlerPageLimitChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handlerNextPage: (e: MouseEvent<HTMLButtonElement>) => void;
  handlerPrevPage: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function TablePagination({
  page = 1,
  pageLimit = 10,
  handlerPageLimitChange,
  handlerNextPage,
  handlerPrevPage,
  totalDocs = 0,
}: TablePaginationType) {
  const startDocs = (page - 1) * pageLimit + 1;
  const endDoc = Math.min(page * pageLimit, totalDocs);
  return (
    <div className="flex items-center justify-end gap-5">
      <p className="text-gray-500">
        Rows per page:{" "}
        <select
          value={pageLimit}
          onChange={handlerPageLimitChange}
          className="rounded-lg border-gray-200 bg-none"
          defaultValue={10}
        >
          {PAGINATION_OPTIONS.map((option: OptionType) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </p>
      <p className="text-gray-500">
        {startDocs}-{endDoc} of {totalDocs}
      </p>
      <div className="flex text-gray-text">
        <button
          type="button"
          onClick={(e) => handlerPrevPage(e)}
          className="size-8 rounded-full p-1 text-xl font-bold text-gray-text transition-colors hover:bg-disabled"
        >
          &#60;
        </button>
        <button
          type="button"
          onClick={(e) => handlerNextPage(e)}
          className="size-8 rounded-full p-1 text-xl font-bold text-gray-text transition-colors hover:bg-disabled"
        >
          &#62;
        </button>
      </div>
    </div>
  );
}
