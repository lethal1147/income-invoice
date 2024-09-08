import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Dialog,
  DialogContent,
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
import {
  createBillSchema,
  CreateBillSchemaType,
  PaymentMethodType,
} from "@/schema/partyBill";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DEFAULT_BILL_MEMBER_OBJ, DEFAULT_BILL_MENU_OBJ } from "../constant";
import { formatCurrencyThaiBath } from "@/utils/formatter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Select from "react-select";
import { THAILAND_BANKS_OPTIONS } from "@/constant/dropdown";
import { customStyles } from "@/configs/style";
import { OptionType } from "@/types/utilsType";
import ImageUploader from "@/components/common/imageUploader";
import useImageUploader from "@/hooks/useImageUploader";
import { createPartyPayBill } from "@/app/actions/partyPay";

export default function CreateBillModal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreateBillSchemaType>({
    resolver: zodResolver(createBillSchema),
  });
  const { previewImage, setImage, clearImage } = useImageUploader({
    setValue: (file) => form.setValue("qrcode", file),
  });
  const paymentMethod = form.watch("paymentMethod");
  const billMenus = useFieldArray({
    control: form.control,
    name: "billMenus",
    rules: { minLength: 1 },
  });
  const members = useFieldArray({
    control: form.control,
    name: "member",
  });
  const onSubmit = async (data: CreateBillSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("body", JSON.stringify(data));
      formData.append("qrcode", data.qrcode as File);
      const result = await createPartyPayBill(formData);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabChange = (val: PaymentMethodType) => {
    form.setValue("paymentMethod", val);

    if (val !== "promptpay") {
      form.setValue("promptpay", "");
    }
    if (val !== "bank") {
      form.setValue("bank", "");
      form.setValue("bankNumber", "");
    }
    if (val !== "qrcode") {
      form.setValue("qrcode", "");
      clearImage();
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
        <ScrollArea className="max-h-[700px] px-5">
          <DialogHeader className="font-bold text-xl pb-5">
            <DialogTitle>Create party bill</DialogTitle>
          </DialogHeader>
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="1">
                  <AccordionTrigger
                    className={cn("", {
                      "text-red-500":
                        form.formState.errors.billMenus &&
                        billMenus.fields?.length <= 0,
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
                                  <Input type="number" {...field} />
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
                                  <Input type="number" {...field} />
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="2">
                  <AccordionTrigger
                    className={cn("", {
                      "text-red-500":
                        form.formState.errors.member &&
                        members.fields.length <= 0,
                    })}
                  >
                    Members
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col px-5">
                    {members.fields.map((member, index) => (
                      <div
                        key={member.name + index}
                        className="flex gap-5 py-2 border-b"
                      >
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
              <Tabs
                className="bg-gray-100 rounded-lg p-3"
                value={paymentMethod}
                onValueChange={(val) =>
                  handleTabChange(val as PaymentMethodType)
                }
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bank">Bank Account</TabsTrigger>
                  <TabsTrigger value="promptpay">PromptPay</TabsTrigger>
                  <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="bg-gray-100 flex flex-col gap-3"
                  value="bank"
                >
                  <FormField
                    control={form.control}
                    name="bank"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormLabel>Bank</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={THAILAND_BANKS_OPTIONS.find(
                              (opt) => opt.value === field.value
                            )}
                            onChange={(val: OptionType) =>
                              field.onChange(val.value)
                            }
                            placeholder="Bank"
                            options={THAILAND_BANKS_OPTIONS}
                            styles={customStyles(error)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="000-0-00000-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent
                  className="bg-gray-100 flex flex-col gap-3"
                  value="promptpay"
                >
                  <FormField
                    control={form.control}
                    name="promptpay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promtpay</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="000-000-0000"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent
                  className="bg-gray-100 flex flex-col gap-3"
                  value="qrcode"
                >
                  <FormField
                    control={form.control}
                    name="qrcode"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormLabel>Qrcode</FormLabel>
                        <FormControl>
                          <ImageUploader
                            field={field}
                            error={error}
                            image={previewImage}
                            onChangeImage={setImage}
                            text="Only accept JPG, PNG size less than 5MB"
                            title="Click or Drag and drop to upload QR Code"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex mt-5 justify-end gap-5">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="self-end"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" className="self-end">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
