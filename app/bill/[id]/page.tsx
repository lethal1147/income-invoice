"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import CopyButton from "./components/copyButton";
import MemberCard from "./components/memberCard";
import useMemberBillStore from "@/stores/memberBillStore";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import LoaderOverLay from "@/components/common/loaderOverlay";
import dayjs from "dayjs";
import { formatCurrencyThaiBath } from "@/utils/formatter";
import { THAILAND_BANKS } from "@/constant/dropdown";
import Image from "next/image";
import { CreditCard, SquareMenu, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PartyPayBillForm from "@/components/form/partyPay/partyPayBillForm";

export default function Page({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const { getPartyPayBillByBillId, billInfo } = useMemberBillStore();
  const { isPending, setStatus } = useStatus(apiStatus.PENDING);

  useEffect(() => {
    if (!params.id) return;
    getPartyPayBillByBillId(params.id);
    setStatus(apiStatus.SUCCESS);
  }, [params.id]);

  return (
    <div className="h-screen p-10 w-screen loginBackGround flex justify-center items-center">
      {isPending && <LoaderOverLay />}
      <div className="w-full h-full bg-white border shadow-lg p-5 rounded-md flex gap-10">
        <div className=" w-[600px] bg-gray-200 px-5 py-3 rounded-md flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">{billInfo?.name}</h1>
            <Dialog onOpenChange={setIsOpen} open={isOpen}>
              <DialogTrigger>
                <Wrench
                  className="hover:text-green-main transition cursor-pointer"
                  size={25}
                />
              </DialogTrigger>
              <DialogContent className="min-w-[800px]">
                <ScrollArea className="max-h-[600px] px-5">
                  <DialogHeader className="font-bold text-xl pb-5">
                    <DialogTitle>Update party bill</DialogTitle>
                  </DialogHeader>
                  <PartyPayBillForm data={billInfo} setIsOpen={setIsOpen} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <h2>{dayjs(billInfo?.date).format("DD MMMM YYYY")}</h2>

          <span className="flex gap-1 font-bold pt-5 text-xl">
            <SquareMenu />
            <h3>Menus</h3>
          </span>
          <ScrollArea>
            <ul className="min-h-[200px]">
              <li className="grid grid-cols-5 gap-1">
                <h6 className="col-span-2 text-center font-semibold line-clamp-1">
                  Menu
                </h6>
                <h6 className="text-center font-semibold">Quantity</h6>
                <h6 className="text-center font-semibold">Price</h6>
                <h6 className="text-center font-semibold">Total</h6>
              </li>
              {billInfo?.billMenus.map((menu) => (
                <li key={menu.id} className="grid grid-cols-5 gap-1">
                  <p className="col-span-2 line-clamp-1">{menu.name}</p>
                  <p>{menu.quantity}</p>
                  <p>{formatCurrencyThaiBath(menu.pricePerItem)}</p>
                  <p>
                    {formatCurrencyThaiBath(menu.pricePerItem * menu.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <div className="pt-5">
            <span className="flex gap-1 pb-2">
              <CreditCard />
              <h3 className="font-bold text-xl">Payment</h3>
            </span>
            <div>
              {billInfo?.paymentMethod === "bank" && (
                <div>
                  <p>
                    ธนาคาร :{" "}
                    {
                      THAILAND_BANKS[
                        billInfo.bank as keyof typeof THAILAND_BANKS
                      ]
                    }
                  </p>
                  <p>เลขบัญชี : {billInfo.bankNumber}</p>
                </div>
              )}
              {billInfo?.paymentMethod === "promptpay" && (
                <p>Promptpay : {billInfo.promptpay}</p>
              )}
              {billInfo?.paymentMethod === "qrcode" && (
                <div className="flex justify-center">
                  <Image
                    src={billInfo.qrcode}
                    alt="QRCODE"
                    height={300}
                    width={300}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between w-full pb-5">
            <h3 className="font-bold text-2xl">Members</h3>
            <CopyButton text="Share" />
          </div>
          <ScrollArea>
            <div className="w-full grow grid grid-cols-3 p-3 gap-5">
              {billInfo?.member.map((mem) => (
                <MemberCard billId={billInfo.id} key={mem.id} member={mem} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
