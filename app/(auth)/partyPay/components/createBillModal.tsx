"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PartyPayBillForm from "@/components/form/partyPay/partyPayBillForm";

export default function CreateBillModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>+ Add new bill</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <ScrollArea className="max-h-[600px] px-5">
          <DialogHeader className="font-bold text-xl pb-5">
            <DialogTitle>Create party bill</DialogTitle>
          </DialogHeader>
          <DialogDescription>Bill information</DialogDescription>
          <PartyPayBillForm setIsOpen={setIsOpen} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
