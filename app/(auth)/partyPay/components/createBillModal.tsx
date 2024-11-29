"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBillSchema, CreateBillSchemaType } from "@/schema/partyBill";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MemberForm from "./memberForm";
import BillMenusForm from "./billMenusForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentTab from "./paymentTab";
import { Checkbox } from "@/components/ui/checkbox";
import useStatus from "@/hooks/useStatus";
import { apiStatus } from "@/constant/status";
import { createPartyPayBill } from "@/app/actions/partyPay/";

export default function CreateBillModal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreateBillSchemaType>({
    resolver: zodResolver(createBillSchema),
  });
  const { setStatus, isPending } = useStatus(apiStatus.IDLE);

  const onSubmit = async (data: CreateBillSchemaType) => {
    try {
      setStatus(apiStatus.PENDING);
      const formData = new FormData();
      formData.append("body", JSON.stringify(data));
      formData.append("qrcode", data.qrcode as File);
      const result = await createPartyPayBill(formData);
      if (result.error) {
        throw new Error(result.message);
      }
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
