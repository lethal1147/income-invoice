"use client";

import NavMenu from "@/components/sidebar/navMenu";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { customStyles } from "@/configs/style";
import { EXPENSE_TYPE_DROPDOWNS } from "@/constant/dropdown";
import { DatePicker } from "@/components/ui/datePicker";
import { Textarea } from "@/components/ui/textarea";
import useWalletStore from "@/stores/walletStore";
import CreateRecordForm from "./components/createRecordForm";
import useExpenseStore from "@/stores/expenseStore";
import { useSession } from "next-auth/react";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import Loader from "@/components/common/loader";
import TablePagination from "@/components/common/tablePagination";
import usePagination from "@/hooks/usePagination";
import {
  formatCurrencyDollar,
  formatDateDefault,
  formatCurrencyThaiBath,
} from "@/utils/formatter";
import { cn } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const { wallet } = useWalletStore();
  const { expenses, getExpenseByUserId } = useExpenseStore();
  const { isPending, setStatus } = useStatus(apiStatus.PENDING);
  const [filterQuery, setFilterQuery] = useState({
    date: null,
    name: "",
    walletId: "",
    type: null,
  });
  const [totalDocs, setTotalDocs] = useState(0);
  const {
    page,
    pageLimit,
    handlerNextPage,
    handlerPrevPage,
    handlerLimitChange,
  } = usePagination({ size: totalDocs });

  useEffect(() => {
    if (!session?.user?.id) return;
    setStatus(apiStatus.PENDING);
    getExpenseByUserId(session?.user?.id, {
      walletId: wallet?.id,
      page,
      pageLimit,
    });
    setStatus(apiStatus.SUCCESS);
  }, [session?.user?.id]);

  console.log(expenses);

  return (
    <div className="flex text-gray-800">
      <NavMenu />
      <Sheet>
        <div className="p-10 gap-10 flex flex-col w-full loginBackGround">
          <div className="bg-white border p-3 w-full rounded-md flex items-end justify-between gap-5">
            <div className="grow">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name" />
            </div>
            <div className="grow">
              <Label htmlFor="name">Date</Label>
              <DatePicker onChange={(val) => null} />
            </div>
            <div className="grow">
              <Label htmlFor="name">Tags</Label>
              <Input id="name" placeholder="Name" />
            </div>
            <div className="grow">
              <Label htmlFor="name">Type</Label>
              <Input id="name" placeholder="Name" />
            </div>
            <SheetTrigger asChild>
              <Button>+ Add record</Button>
            </SheetTrigger>
          </div>

          <div className="w-full bg-white border rounded-md h-full">
            <h2></h2>
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%] text-center"></TableHead>
                  <TableHead className="w-[10%] text-center">Date</TableHead>
                  <TableHead className="w-[40%] text-center">Name</TableHead>
                  <TableHead className="w-[25%] text-center">Tags</TableHead>
                  <TableHead className="w-[10%] text-center">Total</TableHead>
                  <TableHead className="w-[10%] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="w-full min-h-[550px] flex justify-center items-center">
                        <Loader />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((exp, idx) => (
                    <TableRow key={exp.id}>
                      <TableCell className="w-[5%] text-center">
                        {(page - 1) * pageLimit + idx + 1}
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        {formatDateDefault(exp.date)}
                      </TableCell>
                      <TableCell className="w-[40%]">{exp.title}</TableCell>
                      <TableCell className="w-[25%]">ขนม</TableCell>
                      <TableCell
                        className={cn("text-right w-[10%]", {
                          "text-red-500": exp.type === "e",
                          "text-green-500": exp.type === "i",
                        })}
                      >
                        {exp.type === "e"
                          ? `-${formatCurrencyThaiBath(exp.total)}`
                          : `+${formatCurrencyThaiBath(exp.total)}`}
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <div className="flex justify-center ">
                          <Ellipsis />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">
                    <TablePagination
                      handlerPageLimitChange={handlerLimitChange}
                      handlerNextPage={handlerNextPage}
                      handlerPrevPage={handlerPrevPage}
                      totalDocs={totalDocs}
                      page={page}
                      pageLimit={pageLimit}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add new transaction</SheetTitle>
            <CreateRecordForm />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
