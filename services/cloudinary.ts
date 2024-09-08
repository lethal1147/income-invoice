"use server";

import cloudinary from "@/lib/cloudinary";
import { formatErrorMessage } from "@/utils/formatter";
import { UploadApiResponse } from "cloudinary";

export async function uploadToCloudinary(file: File): Promise<{
  error: boolean;
  url: string;
  message?: string;
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const response: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, function (err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          })
          .end(buffer);
      }
    );
    if (response) {
      return { error: false, url: response.url };
    }

    return { error: true, url: "", message: "Something went wrong." };
  } catch (err) {
    return { error: true, url: "", message: formatErrorMessage(err) };
  }
}
