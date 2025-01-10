"use server";

import { readMenuFromReceiptImage } from "@/services/formRecognizer";
import { submitMessageToGPT } from "@/services/openai";
import { formatErrorMessage } from "@/utils/formatter";
import { handleError } from "@/utils/utils";

export async function generateBillMenusByBillImage(body: FormData) {
  try {
    const image = body.get("image") as File;
    if (!image) throw new Error("Image is missing.");
    const { content } = await readMenuFromReceiptImage(image);
    const messageResponse = await submitMessageToGPT(content);

    if (messageResponse) {
      const messageObject = JSON.parse(messageResponse);
      if (messageObject.error) {
        throw new Error(messageObject.message);
      }

      return {
        error: false,
        message: "Generate bill menus successfully.",
        menus: messageObject.menus,
      };
    }
  } catch (err) {
    handleError(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
