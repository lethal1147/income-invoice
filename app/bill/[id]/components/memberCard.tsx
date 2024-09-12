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
import { MemberBillSchemaType } from "@/schema/memberBill";
import { BillMembers } from "@prisma/client";
import React from "react";
import MemberForm from "./memberForm";

type MemberCardPropsType = {
  member: BillMembers;
  billId: string;
};

export default function MemberCard({ member, billId }: MemberCardPropsType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="col-span-1 bg-gray-200 h-auto hover:scale-105 transition shadow-md">
          <CardHeader>
            <CardTitle className="text-green-main">{member.name}</CardTitle>
            <CardDescription>Total : 10000</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{member.status}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>total : 10000</DialogDescription>
          <MemberForm billId={billId} memberId={member.id} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
