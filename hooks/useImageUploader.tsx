import { useState } from "react";

type UseImageUploaderPropType = {
  setValue: (file: File) => void;
};

export default function useImageUploader({
  setValue,
}: UseImageUploaderPropType) {
  const [previewImage, setPreviewImage] = useState<{
    name: string;
    src: string;
  } | null>(null);

  const setImage = (file: File) => {
    if (!file) return;
    setValue(file);

    let base64image = { name: file.name, src: "" };
    const fileReader = new FileReader();

    fileReader.onload = () => {
      base64image.src = fileReader.result as string;
      setPreviewImage(base64image);
    };

    fileReader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
  };

  return {
    previewImage,
    setImage,
    clearImage,
  };
}
