"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { DatePicker } from "../../ui/datePicker";
import { Checkbox } from "@/components/ui/checkbox";
import BillMenusForm from "./billMenusForm";
import MemberForm from "./memberForm";
import PaymentTab from "./paymentTab";
import { Button } from "@/components/ui/button";
import { createBillSchema, CreateBillSchemaType } from "@/schema/partyBill";
import { apiStatus } from "@/constant/status";
import { createPartyPayBill } from "@/app/actions/partyPay";
import usePartyBillStore from "@/stores/partyBillStore";
import useStatus from "@/hooks/useStatus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

export default function PartyPayBillForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const form = useForm<CreateBillSchemaType>({
    resolver: zodResolver(createBillSchema),
  });
  const { setStatus, isPending } = useStatus(apiStatus.IDLE);
  const { getPartyBillCalendar } = usePartyBillStore();
  const { toast } = useToast();

  const onSubmit = async (data: CreateBillSchemaType) => {
    try {
      if (!session?.user?.id) return;
      setStatus(apiStatus.PENDING);
      const formData = new FormData();
      formData.append("body", JSON.stringify(data));
      formData.append("qrcode", data.qrcode as File);
      const result = await createPartyPayBill(formData);
      if (result.error) {
        throw new Error(result.message);
      }
      toast({
        title: "✅ Create transaction successfully!",
      });
      getPartyBillCalendar(session.user.id);
      setStatus(apiStatus.SUCCESS);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      setStatus(apiStatus.ERROR);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    const resetForm: Partial<CreateBillSchemaType> = {
      userId: session.user.id,
      billMenus: [],
      member: [],
      vatFlag: false,
      serviceChargeFlag: false,
      paymentMethod: "bank",
    };

    form.reset(resetForm);
  }, [session?.user?.id]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 px-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker {...field} id="date" />
              </FormControl>
            </FormItem>
          )}
        />
        <BillMenusForm form={form} />
        <MemberForm form={form} />
        <div className="flex gap-8 items-end border-b pb-5">
          <FormField
            control={form.control}
            name="vatFlag"
            render={({ field }) => (
              <FormItem className="flex items-end gap-2">
                <FormLabel>Vat (7%)</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceChargeFlag"
            render={({ field }) => (
              <FormItem className="flex items-end gap-2">
                <FormLabel>Service charge (10%)</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <h3 className="font-bold">Payment</h3>
        <PaymentTab form={form} />
        <div className="flex mt-5 justify-end gap-5">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="self-end"
            variant="outline"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="submit" className="self-end">
            {isPending ? "Pending..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}