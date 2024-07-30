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
import React from "react";
import { customStyles } from "@/configs/style";
import { EXPENSE_TYPE_DROPDOWNS } from "@/constant/dropdown";
import { DatePicker } from "@/components/ui/datePicker";
import { Textarea } from "@/components/ui/textarea";
import useWalletStore from "@/stores/walletStore";
import CreateRecordForm from "./components/createRecordForm";

export default function Page() {
  const { walletDropdown, selectWallet, wallet } = useWalletStore();
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
              <Input id="name" placeholder="Name" />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center"></TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Tags</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>7/21/2024</TableCell>
                  <TableCell>ค่าเบียร์</TableCell>
                  <TableCell>ขนม</TableCell>
                  <TableCell className="text-red-500">-1000</TableCell>
                  <TableCell className="flex justify-center">
                    <Ellipsis />
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter></TableFooter>
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
