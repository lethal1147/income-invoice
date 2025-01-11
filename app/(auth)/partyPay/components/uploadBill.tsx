"use client";

import { generateBillMenusByBillImage } from "@/app/actions/partyPay/";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiStatus } from "@/constant/status";
import useStatus from "@/hooks/useStatus";
import { CreateBillSchemaType } from "@/schema/partyBill";
import { handleError } from "@/utils/utils";
import { Camera } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type UploadBillPropsType = {
  form: UseFormReturn<CreateBillSchemaType>;
};

export default function UploadBill({ form }: UploadBillPropsType) {
  const [formOpen, setFormOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { isPending, setStatus } = useStatus();

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
  };

  const onGenerateBillMenus = async () => {
    if (!uploadedFile) return;
    try {
      setStatus(apiStatus.PENDING);
      const formData = new FormData();
      formData.append("image", uploadedFile);
      const res = await generateBillMenusByBillImage(formData);
      setStatus(apiStatus.SUCCESS);
      if (res && res?.error) {
        throw new Error(res.message);
      }
      console.log(res);
      form.setValue("billMenus", res?.menus || []);
      setFormOpen(false);
    } catch (err) {
      handleError(err);
      setStatus(apiStatus.ERROR);
    }
  };

  return (
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <DialogTrigger>
        <Button
          variant="secondary"
          className="size-8 p-1 rounded-full self-center mb-2 text-green-main"
          type="button"
        >
          <Camera className="font-bold" size={80} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload your bill</DialogTitle>
        <DialogDescription>
          For automatic generate bill menus.
        </DialogDescription>
        <Input
          disabled={isPending}
          onChange={onSelectFile}
          accept="image/png, image/jpeg"
          type="file"
        />
        <Button
          disabled={isPending}
          type="button"
          onClick={onGenerateBillMenus}
          size="sm"
        >
          {isPending ? "Generating..." : "Generate"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
