"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import MemberForm from "./memberForm";
import { BillMemberWithInclude } from "@/types/partyBillType";

type MemberCardPropsType = {
  member: BillMemberWithInclude;
  billId: string;
};

export default function MemberCard({ member, billId }: MemberCardPropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const total = member.memberMenus.reduce(
    (acc, cur) => acc + cur.billMenu.pricePerItem * cur.quantity,
    0
  );

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Card className="col-span-1 bg-gray-200 h-auto hover:scale-105 transition shadow-md">
          <CardHeader>
            <CardTitle className="text-green-main">{member.name}</CardTitle>
            <CardDescription>Total : {total}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{member.status}</p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="min-w-[800px] z-50">
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>total : 10000</DialogDescription>
        </DialogHeader>
        <MemberForm
          member={member}
          setIsOpen={setIsOpen}
          billId={billId}
          memberId={member.id}
        />
      </DialogContent>
    </Dialog>
  );
}
