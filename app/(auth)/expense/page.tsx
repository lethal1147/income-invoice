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
import useWalletStore from "@/stores/walletStore";
import CreateRecordForm from "./components/createRecordForm";
import useExpenseStore from "@/stores/expenseStore";
import { useSession } from "next-auth/react";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import Loader from "@/components/common/loader";
import TablePagination from "@/components/common/tablePagination";
import usePagination from "@/hooks/usePagination";
import { formatDateDefault, formatCurrencyThaiBath } from "@/utils/formatter";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/datePickerRange";
import dayjs from "dayjs";
import { OptionType } from "@/types/utilsType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseWithInclude } from "@/types/expenseType";
import { useToast } from "@/components/ui/use-toast";
import ConfirmDeleteDialog from "./components/confirmDeleteDialog";

type Types = "e" | "i" | undefined;

type FilterQuery = {
  name?: string;
  tags?: string;
  type?: Types;
};

export default function Page() {
  const { data: session } = useSession();
  const { wallet } = useWalletStore();
  const {
    expenses,
    getExpenseByUserId,
    totalExpenses,
    deleteExpenseByExpenseId,
  } = useExpenseStore();
  const { isPending, setStatus } = useStatus(apiStatus.PENDING);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>({
    name: "",
    type: undefined,
    tags: "",
  });
  const [filterDate, setFilterDate] = useState({
    from: dayjs().startOf("month").toDate(),
    to: dayjs().endOf("month").toDate(),
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateExpense, setUpdateExpense] = useState<null | ExpenseWithInclude>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    page,
    pageLimit,
    handlerNextPage,
    handlerPrevPage,
    handlerLimitChange,
  } = usePagination({ size: totalExpenses });

  useEffect(() => {
    setStatus(apiStatus.PENDING);
    const debounce = setTimeout(() => {
      if (!session?.user?.id) return;
      getExpenseByUserId(session?.user?.id, {
        walletId: wallet?.id,
        page,
        pageLimit,
        date: filterDate,
        tags: filterQuery.tags,
        name: filterQuery.name,
        type: filterQuery.type,
      });
      setStatus(apiStatus.SUCCESS);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [session?.user?.id, page, pageLimit, filterDate, filterQuery]);

  const onDelete = async () => {
    try {
      if (!deleteTarget) return;
      setStatus(apiStatus.PENDING);
      deleteExpenseByExpenseId(deleteTarget);
      if (session?.user?.id) {
        getExpenseByUserId(session?.user?.id, {
          walletId: wallet?.id,
          page,
          pageLimit,
          date: filterDate,
          tags: filterQuery.tags,
          name: filterQuery.name,
          type: filterQuery.type,
        });
      }
      setStatus(apiStatus.SUCCESS);
      toast({
        title: "Delete transaction successfully.",
      });
      return true;
    } catch (err) {
      setStatus(apiStatus.ERROR);
      return false;
    }
  };

  return (
    <main className="flex text-gray-800">
      <NavMenu />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="p-10 gap-10 flex flex-col w-full loginBackGround">
          <div className="bg-white border p-3 w-full rounded-md flex items-end justify-between gap-5">
            <div className="grow">
              <Label htmlFor="name">Name</Label>
              <Input
                onChange={(e) =>
                  setFilterQuery((prev) => ({ ...prev, name: e.target.value }))
                }
                id="name"
                placeholder="Name"
              />
            </div>
            <div className="grow flex flex-col">
              <Label htmlFor="name">Date</Label>
              <div className="grow">
                <DatePickerWithRange
                  value={filterDate}
                  onSelect={setFilterDate}
                />
              </div>
            </div>
            <div className="grow">
              <Label htmlFor="name">Tags</Label>
              <Input
                onChange={(e) =>
                  setFilterQuery((prev) => ({ ...prev, tags: e.target.value }))
                }
                value={filterQuery.tags}
                id="tags"
                placeholder="Tag name"
              />
            </div>
            <div className="grow">
              <Label htmlFor="name">Type</Label>
              <Select
                value={EXPENSE_TYPE_DROPDOWNS.find(
                  (opt) => opt.value === filterQuery.type
                )}
                onChange={(val: OptionType) =>
                  setFilterQuery((prev) => ({
                    ...prev,
                    type: val.value as Types,
                  }))
                }
                options={EXPENSE_TYPE_DROPDOWNS}
                placeholder="Type"
                styles={customStyles()}
              />
            </div>
            <Button
              onClick={() => {
                setUpdateExpense(null);
                setIsSheetOpen(true);
              }}
              type="button"
            >
              + Add record
            </Button>
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
                      <TableCell className="w-[25%]">
                        <div className="flex gap-2">
                          {exp.expenseTag.map((tag) => (
                            <div
                              key={tag.id}
                              className="w-auto px-5 py-1 rounded-lg bg-gray-200"
                            >
                              <p>{tag.tag.name}</p>
                            </div>
                          ))}
                        </div>
                      </TableCell>
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
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className=" size-8 flex justify-center items-center hover:bg-gray-200 cursor-pointer rounded-full">
                                <Ellipsis />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setUpdateExpense(exp);
                                  setIsSheetOpen(true);
                                }}
                              >
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeleteTarget(exp.id);
                                  setIsDialogOpen(true);
                                }}
                              >
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                      totalDocs={totalExpenses}
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
            <CreateRecordForm
              closeSheet={() => setIsSheetOpen(false)}
              updateExpense={updateExpense}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        onConfirm={onDelete}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        title="Are you sure?"
        description=" This action cannot be undone. This will permanently delete your transaction."
      />
    </main>
  );
}
