import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateBillSchemaType } from "@/schema/partyBill";
import { formatCurrencyThaiBath } from "@/utils/formatter";
import { Plus, X } from "lucide-react";
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { DEFAULT_BILL_MENU_OBJ } from "../constant";

type BillMenusFormPropsType = {
  form: UseFormReturn<CreateBillSchemaType>;
};

export default function BillMenusForm({ form }: BillMenusFormPropsType) {
  const billMenus = useFieldArray({
    control: form.control,
    name: "billMenus",
    rules: { minLength: 1 },
  });
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="1">
        <AccordionTrigger
          className={cn("", {
            "text-red-500":
              form.formState.errors.billMenus && billMenus.fields?.length <= 0,
          })}
        >
          Menus
        </AccordionTrigger>
        <AccordionContent className="flex flex-col px-5">
          {billMenus.fields.map((menu, index) => {
            const total =
              +form.watch(`billMenus.${index}.quantity`) *
              +form.watch(`billMenus.${index}.pricePerItem`);
            return (
              <div
                key={menu.name + index}
                className="flex justify-between gap-5 py-2 border-b"
              >
                <FormField
                  control={form.control}
                  name={`billMenus.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`billMenus.${index}.pricePerItem`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per item</FormLabel>
                      <FormControl>
                        <Input min={0} type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`billMenus.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input min={1} type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <p className="self-end py-3 min-w-16 text-end">
                  {formatCurrencyThaiBath(total || 0)}
                </p>
                <Button
                  onClick={() => billMenus.remove(index)}
                  type="button"
                  className="bg-red-500 hover:bg-red-500/80 p-0.5 my-2 size-6 self-end"
                >
                  <X />
                </Button>
              </div>
            );
          })}

          <Button
            onClick={() => billMenus.append(DEFAULT_BILL_MENU_OBJ)}
            className="size-8 p-1 rounded-full self-center my-3"
            type="button"
          >
            <Plus className="font-bold" size={100} />
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
