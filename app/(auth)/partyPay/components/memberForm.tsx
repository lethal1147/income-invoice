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
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { DEFAULT_BILL_MEMBER_OBJ } from "../constant";
import { Plus, X } from "lucide-react";

type MemberFormPropsType = {
  form: UseFormReturn<CreateBillSchemaType>;
};

export default function MemberForm({ form }: MemberFormPropsType) {
  const members = useFieldArray({
    control: form.control,
    name: "member",
    rules: { minLength: 1 },
  });
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="2">
        <AccordionTrigger
          className={cn("", {
            "text-red-500":
              form.formState.errors.member && members.fields.length <= 0,
          })}
        >
          Members
        </AccordionTrigger>
        <AccordionContent className="flex flex-col px-5">
          {members.fields.map((member, index) => (
            <div key={member.name + index} className="flex gap-5 py-2 border-b">
              <FormField
                name={`member.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                onClick={() => members.remove(index)}
                type="button"
                className="bg-red-500 hover:bg-red-500/80 p-0.5 size-6 my-2 self-end"
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => members.append(DEFAULT_BILL_MEMBER_OBJ)}
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
