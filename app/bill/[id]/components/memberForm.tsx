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
import { cn } from "@/lib/utils";
import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import useMemberBillStore from "@/stores/memberBillStore";
import { formatCurrencyThaiBath } from "@/utils/formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";

type MemberFormPropsType = {
  memberId: string;
  billId: string;
};

export default function MemberForm({ memberId, billId }: MemberFormPropsType) {
  const form = useForm<MemberBillSchemaType>({
    resolver: zodResolver(memberBillSchema),
  });
  const menus = useFieldArray({
    control: form.control,
    name: "menus",
    rules: { minLength: 1 },
  });
  const { menusDropdown, getMenusByBillId } = useMemberBillStore();
  console.log(menusDropdown);
  const onSubmit = async (data: MemberBillSchemaType) => {
    console.log(data);
  };

  useEffect(() => {
    if (!memberId) return;
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
            <AccordionContent className="flex flex-col px-5">
              {menus.fields.map((menu, index) => {
                const total = +form.watch(`menus.${index}.quantity`);

                return (
                  <div
                    key={menu.menuId + index}
                    className="flex justify-between gap-5 py-2 border-b"
                  >
                    <FormField
                      control={form.control}
                      name={`menus.${index}.menuId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Menu name</FormLabel>
                          <FormControl>
                            <Select {...field} options={menusDropdown} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
                );
              })}

              <Button
                onClick={() => menus.append({ menuId: "", quantity: "1" })}
                className="size-8 p-1 rounded-full self-center my-3"
                type="button"
              >
                <Plus className="font-bold" size={100} />
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
