"use server";

import { db } from "@/lib/db";
import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import { createBillSchema } from "@/schema/partyBill";
import { uploadToCloudinary } from "@/services/cloudinary";
import { readMenuFromReceiptImage } from "@/services/formRecognizer";
import { submitMessageToGPT } from "@/services/openai";
import { formatErrorMessage, generatePublicId } from "@/utils/formatter";
import { PartyBill, PaymentMethod } from "@prisma/client";
import dayjs from "dayjs";

export async function createPartyPayBill(formData: FormData) {
  const bodyJson = formData.get("body") as string;
  if (!bodyJson) {
    return { error: true, message: "Invalid body." };
  }
  const body = JSON.parse(bodyJson);

  const validatedFields = createBillSchema.safeParse({
    ...body,
    date: dayjs(body.date).add(7, "hour").toDate(),
    qrcode: body.qrcode?.path || "",
  });
  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: true,
      message: "Invalid body.",
    };
  }

  const {
    name,
    date,
    vatFlag,
    serviceChargeFlag,
    member,
    billMenus,
    userId,
    paymentMethod,
    bank,
    bankNumber,
    promptpay,
  } = validatedFields.data;
  try {
    let qrcode = "";
    if (paymentMethod === "qrcode") {
      const qrcodeFile = formData.get("qrcode") as File;
      if (!qrcodeFile) {
        return {
          error: true,
          message: "Payment method is QR code but missing QR code image.",
        };
      }
      const cloudinaryRes = await uploadToCloudinary(qrcodeFile);
      if (cloudinaryRes.error)
        throw new Error("Error on upload to cloudinary.");

      qrcode = cloudinaryRes.url;
    }

    let generatedPublicId: string;
    let existedPublicId: PartyBill | null | undefined;
    do {
      generatedPublicId = generatePublicId(date);
      existedPublicId = await prisma?.partyBill.findUnique({
        where: {
          billPublicId: generatedPublicId,
        },
      });
    } while (!!existedPublicId);

    await db.$transaction(async (prisma) => {
      const partyPay = await prisma.partyBill.create({
        data: {
          name,
          date,
          vatFlag,
          serviceChargeFlag,
          userId,
          paymentMethod: paymentMethod as PaymentMethod,
          bank: bank || "",
          bankNumber: bankNumber || "",
          promptpay: promptpay || "",
          qrcode,
          billPublicId: generatedPublicId,
        },
      });

      for (let i = 0; i < billMenus.length; i++) {
        const { name: menuName, quantity, pricePerItem } = billMenus[i];
        await prisma.billMenus.create({
          data: {
            name: menuName,
            quantity: +quantity,
            pricePerItem: +pricePerItem,
            partyBillId: partyPay.id,
          },
        });
      }

      for (let i = 0; i < member.length; i++) {
        const { name: memberName } = member[i];
        await prisma.billMembers.create({
          data: {
            name: memberName,
            partyBillId: partyPay.id,
          },
        });
      }
    });

    return { error: false, message: "Create new party pay successfully." };
  } catch (err) {
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}

export async function getPartyPayBillByUserId(userId: string) {
  if (!userId) {
    return { error: true, message: "User id is required." };
  }
  try {
    const partyBills = await prisma?.partyBill.findMany({
      include: {
        billMembers: {
          include: { memberMenus: true },
        },
        billMenus: true,
      },
      where: {
        userId,
      },
    });

    return { error: false, data: partyBills };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}

export async function getPartyPayBillByBillId(billId: string) {
  if (!billId) {
    return { error: true, message: "User id is required." };
  }
  try {
    const partyBill = await prisma?.partyBill.findUnique({
      include: {
        billMembers: {
          include: { memberMenus: true },
        },
        billMenus: true,
      },
      where: {
        id: billId,
      },
    });

    return { error: false, data: partyBill };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}

export async function getMenusByBillId(billId: string) {
  try {
    if (!billId) {
      return { error: true, message: "User id is required." };
    }

    const result = await db.billMenus.findMany({
      where: {
        partyBillId: billId,
      },
    });

    return { error: false, data: result };
  } catch (err) {
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}

export async function updateMemberMenu(body: MemberBillSchemaType) {
  const validatedData = memberBillSchema.safeParse(body);
  if (!validatedData.success) {
    return { error: true, message: "Invalid body." };
  }
  try {
    // const memberMenu = await prisma?.memberMenus.create({
    // data: {},
    // });
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}

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
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
