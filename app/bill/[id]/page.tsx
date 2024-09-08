"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
import CopyButton from "./components/copyButton";
import MemberCard from "./components/memberCard";
import useMemberBillStore from "@/stores/memberBillStore";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import Loader from "@/components/common/loader";

export default function Page({ params }: { params: { id: string } }) {
  const { getPartyPayBillByBillId, billInfo } = useMemberBillStore();
  const { isPending, setStatus } = useStatus(apiStatus.PENDING);
  useEffect(() => {
    if (!params.id) return;
    getPartyPayBillByBillId(params.id);
    setStatus(apiStatus.SUCCESS);
  }, [params.id]);
  return (
    <div className="h-screen p-10 w-screen loginBackGround flex justify-center items-center">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}
      <div className="w-full h-full bg-white border shadow-lg p-5 rounded-md flex gap-10">
        <div className=" w-[400px] bg-gray-200 rounded-md"></div>
        <div className="w-full">
          <div className="flex justify-between w-full pb-5">
            <h1 className="font-bold text-2xl">Members</h1>
            <CopyButton />
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
