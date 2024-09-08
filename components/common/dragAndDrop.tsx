import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";
import { Accept, useDropzone } from "react-dropzone";

interface DragAndDropProps {
  onChange: (files: File[]) => void;
  onBlur: () => void;
  value?: File[];
  accept: Accept;
  children: ReactNode;
}

const DragAndDrop = forwardRef<HTMLDivElement, DragAndDropProps>(
  ({ onChange, onBlur, value, accept = {}, children }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      onDrop: (acceptedFiles) => {
        onChange([...(value || []), ...acceptedFiles]);
      },
      multiple: true,
    });
    return (
      <div
        ref={ref}
        className={cn(
          "flex size-full cursor-pointer items-center justify-center hover:bg-checkbox-blue/10 active:bg-checkbox-blue/10",
          isDragActive ? "bg-checkbox-blue/10" : ""
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} onBlur={onBlur} />
        {children}
      </div>
    );
  }
);

DragAndDrop.displayName = "DragAndDrop";

export default DragAndDrop;
