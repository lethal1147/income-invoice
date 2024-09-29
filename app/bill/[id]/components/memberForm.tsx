import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customStyles } from "@/configs/style";
import { cn } from "@/lib/utils";
import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import useMemberBillStore from "@/stores/memberBillStore";
import { OptionType } from "@/types/utilsType";
import { formatCurrencyThaiBath } from "@/utils/formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MemberFormPropsType = {
  memberId: string;
  billId: string;
};

export default function MemberForm({ memberId, billId }: MemberFormPropsType) {
  const form = useForm<MemberBillSchemaType>({
    resolver: zodResolver(memberBillSchema),
    defaultValues: {
      menus: [],
    },
  });
  const menus = useFieldArray({
    control: form.control,
    name: "menus",
    rules: { minLength: 1 },
  });
  const {
    menusDropdown,
    getMenusByBillId,
    menus: menuList,
    billInfo,
  } = useMemberBillStore();
  const selectedMenu = form.watch("menus")?.map((mn) => mn.menuId);
  const menusForm = form.watch("menus");
  const newTotal = menusForm.reduce((acc, cur) => {
    const menuInfo = menuList.find((mn) => mn.id === cur.menuId);
    if (menuInfo) {
      return acc + menuInfo.pricePerItem * +cur.quantity;
    }
    return acc;
  }, 0);

  const vat = billInfo?.vatFlag ? (newTotal * 7) / 100 : 0;
  const serviceCharge = billInfo?.serviceChargeFlag ? (newTotal * 10) / 100 : 0;
  const net = newTotal + serviceCharge + vat;

  const onSubmit = async (data: MemberBillSchemaType) => {
    try {
      const cleanData = {
        ...data,
        menus: data.menus.filter((menu) => menu.menuId),
      };
      console.log(cleanData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!memberId || !billId) return;
    const resetForm: Partial<MemberBillSchemaType> = {
      menus: [],
      memberId,
    };
    form.reset(resetForm);
  }, [memberId]);

  useEffect(() => {
    if (!billId) return;
    getMenusByBillId(billId);
  }, [billId]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger
              className={cn("", {
                "text-red-500":
                  form.formState.errors.menus && menus.fields?.length <= 0,
              })}
            >
              Menus
            </AccordionTrigger>
            <AccordionContent className="flex flex-col px-5 ">
              {menus.fields.map((menu, index) => {
                const menuId = form.watch(`menus.${index}.menuId`);
                const menuData = menuList.find((mn) => mn.id === menuId);
                const quantity = +form.watch(`menus.${index}.quantity`);
                const total = quantity * (menuData?.pricePerItem || 0);
                return (
                  <div
                    key={menu.menuId + index}
                    className="flex justify-between gap-5 py-2 border-b"
                  >
                    <div className="w-3/5">
                      <FormField
                        control={form.control}
                        name={`menus.${index}.menuId`}
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <FormLabel>Menu name</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Menu's name" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                className={cn("z-[9999]", {
                                  "border-red-500": error,
                                })}
                              >
                                {menusDropdown
                                  .filter(
                                    (dropdown) =>
                                      !selectedMenu.includes(
                                        dropdown.value.toString()
                                      ) || dropdown.value === field.value
                                  )
                                  .map((menu) => (
                                    <SelectItem
                                      key={menu.value}
                                      value={menu.value as string}
                                    >
                                      {menu.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-1/5">
                      <FormField
                        control={form.control}
                        name={`menus.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                max={menuData?.quantity}
                                type="number"
                                {...field}
                                min={1}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-5 w-1/5">
                      <p className="self-end py-3 min-w-16 text-end">
                        {formatCurrencyThaiBath(total || 0)}
                      </p>
                      <Button
                        onClick={() => menus.remove(index)}
                        type="button"
                        className="bg-red-500 hover:bg-red-500/80 p-0.5 my-2 size-6 self-end"
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {menus.fields.length < menuList.length && (
                <Button
                  onClick={() =>
                    menus.append({
                      menuId: "",
                      quantity: "1",
                    })
                  }
                  className="size-8 p-1 rounded-full self-center my-3"
                  type="button"
                >
                  <Plus className="font-bold" size={100} />
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="w-1/2 self-end grid grid-cols-2 justify-end text-end">
          <p>Vat(7%)</p>
          <p>{formatCurrencyThaiBath(vat)}</p>
          <p>Service charge(10%)</p>
          <p>{formatCurrencyThaiBath(serviceCharge)}</p>
          <p>Total</p>
          <p>{formatCurrencyThaiBath(net)}</p>
        </div>

        <div className="flex justify-end gap-5">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
