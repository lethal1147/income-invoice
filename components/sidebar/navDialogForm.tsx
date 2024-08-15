"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema, WalletSchemaType } from "@/schema/wallet";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createWallet } from "@/app/actions/wallet";
import { useSession } from "next-auth/react";

export default function NavDialogForm() {
  const { data: session } = useSession();
  const form = useForm<WalletSchemaType>({
    defaultValues: {
      userId: session?.user?.id,
    },
    resolver: zodResolver(walletSchema),
  });

  useEffect(() => {
    form.reset({
      userId: session?.user?.id,
    });
  }, [session?.user?.id]);

  const onSubmitHandler = async (data: WalletSchemaType) => {
    const res = await createWallet(data);
    console.log(res)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Create New Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="flex flex-col gap-3"
          >
            <p className="text-primary">Create New Wallet</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name<strong className="text-red-500">*</strong>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Starter Balance<strong className="text-red-500">*</strong>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-1/2 self-center mt-10">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
