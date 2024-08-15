"use client";

import { createExpense } from "@/app/actions/expense";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { customStyles } from "@/configs/style";
import { EXPENSE_TYPE_DROPDOWNS } from "@/constant/dropdown";
import {
  CreateExpenseBodySchema,
  createExpenseBodySchema,
} from "@/schema/expense";
import useTagStore from "@/stores/tagStore";
import useWalletStore from "@/stores/walletStore";
import { OptionType } from "@/types/utilsType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";

export default function CreateRecordForm() {
  const { data: session } = useSession();
  const form = useForm<CreateExpenseBodySchema>({
    resolver: zodResolver(createExpenseBodySchema),
    defaultValues: {
      expenseTag: [],
      userId: session?.user?.id,
    },
  });
  const { walletDropdown } = useWalletStore();
  const { tagsDropdown, getTags } = useTagStore();

  const onSubmitHandler = async (data: CreateExpenseBodySchema) => {
    try {
      const result = await createExpense(data);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!session) return;

    form.reset({
      userId: session?.user?.id,
    });
    getTags(session?.user?.id as string);
  }, [session?.user?.id]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-5"
      >
        <div>
          <FormField
            name="walletId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={walletDropdown.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(val: OptionType) => field.onChange(val.value)}
                    options={walletDropdown}
                    placeholder="Wallet"
                    styles={customStyles}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="Name" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={EXPENSE_TYPE_DROPDOWNS.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(val: OptionType) => field.onChange(val.value)}
                    options={EXPENSE_TYPE_DROPDOWNS}
                    placeholder="Type"
                    styles={customStyles}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            name="expenseTag"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <CreatableSelect
                    {...field}
                    value={field.value}
                    onChange={(newVal: MultiValue<OptionType>) =>
                      field.onChange(newVal)
                    }
                    options={tagsDropdown}
                    placeholder="Tags"
                    styles={customStyles}
                    isMulti
                    isClearable
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full">
          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} id="dateForm" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            name="total"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Total" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    id="descriptionForm"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
