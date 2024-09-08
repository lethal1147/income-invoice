import { Upload } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import DragAndDrop from "./dragAndDrop";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { CreateBillSchemaType } from "@/schema/partyBill";

type ImageUploaderProp = {
  image: {
    name: string;
    src: string;
  } | null;
  error?: FieldError;
  onChangeImage: (file: File) => void;
  field: ControllerRenderProps<CreateBillSchemaType, "qrcode">;
  title: string;
  text?: string;
};

export default function ImageUploader({
  image,
  error,
  onChangeImage,
  field,
  title,
  text,
}: ImageUploaderProp) {
  return (
    <div className="size-full">
      {image ? (
        <div className="items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 bg-blue-50">
          <div
            key={image.name}
            className=" overflow-hidden rounded-xl"
            onClick={() => document.getElementById("fileInput")?.click()}
            role="button"
            aria-hidden
          >
            <Image
              width={400}
              height={350}
              className="mx-auto size-auto"
              src={image.src}
              alt="preview"
            />
          </div>
          <Input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (!file) return;
              onChangeImage(file);
            }}
          />
        </div>
      ) : (
        <div
          className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed  bg-blue-50 p-4 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <DragAndDrop
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
            }}
            {...field}
            onChange={(files) => {
              const file = files ? files[0] : null;
              if (!file) return;
              onChangeImage(file);
            }}
          >
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center">
                <Upload />
                <p className="font-bold">
                  <span className="text-sky-primary">{title}</span>
                </p>
                {text && <p className="text-xs text-gray-hint">{text}</p>}
              </div>
            </div>
          </DragAndDrop>
        </div>
      )}
    </div>
  );
}
