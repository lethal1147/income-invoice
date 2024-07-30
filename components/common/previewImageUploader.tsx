import { FieldError } from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PreviewImageUploaderPropsType {
  image: File | string | undefined;
  error?: FieldError;
}

export default function PreviewImageUploader({
  image,
  error,
}: PreviewImageUploaderPropsType) {
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    if (image instanceof File) {
      const fileUrl = URL.createObjectURL(image);
      setPreviewImage(fileUrl);

      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }

    return setPreviewImage(undefined);
  }, [image]);

  return (
    <div
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-200",
        error ? "border border-main-red" : ""
      )}
    >
      {previewImage ? (
        <Image
          width={140}
          height={140}
          src={previewImage}
          alt="profile"
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full text-transparent transition-all duration-150 hover:bg-black/50 hover:text-white">
        <span className="text-sm">Change Image</span>
      </div>
    </div>
  );
}
