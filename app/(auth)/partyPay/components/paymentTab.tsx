import ImageUploader from "@/components/common/imageUploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customStyles } from "@/configs/style";
import { THAILAND_BANKS_OPTIONS } from "@/constant/dropdown";
import useImageUploader from "@/hooks/useImageUploader";
import { CreateBillSchemaType, PaymentMethodType } from "@/schema/partyBill";
import { OptionType } from "@/types/utilsType";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Select from "react-select";

type PaymentTabPropsType = {
  form: UseFormReturn<CreateBillSchemaType>;
};

export default function PaymentTab({ form }: PaymentTabPropsType) {
  const paymentMethod = form.watch("paymentMethod");
  const { previewImage, setImage, clearImage } = useImageUploader({
    setValue: (file) => form.setValue("qrcode", file),
  });

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

  return (
    <Tabs
      className="bg-gray-100 rounded-lg p-3"
      value={paymentMethod}
      onValueChange={(val) => handleTabChange(val as PaymentMethodType)}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bank">Bank Account</TabsTrigger>
        <TabsTrigger value="promptpay">PromptPay</TabsTrigger>
        <TabsTrigger value="qrcode">QR Code</TabsTrigger>
      </TabsList>
      <TabsContent className="bg-gray-100 flex flex-col gap-3" value="bank">
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
                  onChange={(val: OptionType) => field.onChange(val.value)}
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
                <Input {...field} type="text" placeholder="000-0-00000-0" />
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
                <Input {...field} type="text" placeholder="000-000-0000" />
              </FormControl>
            </FormItem>
          )}
        />
      </TabsContent>
      <TabsContent className="bg-gray-100 flex flex-col gap-3" value="qrcode">
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
  );
}
