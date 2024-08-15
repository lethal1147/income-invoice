import { ChangeEvent, MouseEvent, useState } from "react";

type UsePaginationProps = {
  size: number;
};

export default function usePagination({ size }: UsePaginationProps) {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const totalPage = Math.ceil(size / pageLimit);

  const handlerNextPage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page !== totalPage) setPage((prev) => prev + 1);
  };

  const handlerPrevPage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page !== 1) setPage((prev) => prev - 1);
  };

  const handlerLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPageLimit(+e.target.value);
  };

  return {
    page,
    pageLimit,
    handlerNextPage,
    handlerPrevPage,
    handlerLimitChange,
  };
}
