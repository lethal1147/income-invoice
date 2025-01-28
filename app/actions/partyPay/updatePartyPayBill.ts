"use server";

import { db } from "@/lib/db";
import { createBillSchema } from "@/schema/partyBill";
import { uploadToCloudinary } from "@/services/cloudinary";
import { formatErrorMessage, generatePublicId } from "@/utils/formatter";
// import { handleError } from "@/utils/utils";
import { PaymentMethod } from "@prisma/client";
import dayjs from "dayjs";

export async function updatePartyPayBill(formData: FormData) {
  const bodyJson = formData.get("body") as string;
  if (!bodyJson) {
    return { error: true, message: "Invalid body" };
  }

  const body = JSON.parse(bodyJson);
  const validatedFields = createBillSchema.safeParse({
    ...body,
    date: dayjs(body.date).add(7, "hour").toDate(),
    qrcode: body.qrcode?.path || "",
  });

  if (!validatedFields.success) {
    return {
      error: true,
      message: "Invalid body.",
    };
  }

  const {
    id,
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
      if (!qrcodeFile)
        throw new Error("Payment method is QR code but missing QR code image.");

      const cloudinaryRes = await uploadToCloudinary(qrcodeFile);
      if (cloudinaryRes.error)
        throw new Error("Error on upload to cloudinary.");

      qrcode = cloudinaryRes.url;
    }

    let generatedPublicId: string = generatePublicId(date);
    await db.$transaction(async (prisma) => {
      const partyPay = await prisma.partyBill.update({
        where: {
          id,
        },
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

      // update & create bill menus
      const existMenus = await prisma.billMenus.findMany({
        where: {
          partyBillId: id,
        },
      });
      const oldMenus = existMenus.map((menu) => menu.id);
      const newMenus = billMenus.map((menu) => menu.id);
      const notExistMenus = oldMenus.filter((id) => !newMenus.includes(id));
      if (notExistMenus.length) {
        await prisma.billMenus.deleteMany({
          where: {
            id: { in: notExistMenus },
          },
        });
      }
      for (let i = 0; i < billMenus.length; i++) {
        const {
          name: menuName,
          quantity,
          pricePerItem,
          id: menuId,
        } = billMenus[i];
        if (menuId) {
          await prisma.billMenus.update({
            where: {
              id: menuId,
            },
            data: {
              name: menuName,
              quantity: +quantity,
              pricePerItem: +pricePerItem,
              partyBillId: partyPay.id,
            },
          });
        } else {
          await prisma.billMenus.create({
            data: {
              name: menuName,
              quantity: +quantity,
              pricePerItem: +pricePerItem,
              partyBillId: partyPay.id,
            },
          });
        }
      }

      // update & create bill member
      const existMember = await prisma.billMembers.findMany({
        where: {
          partyBillId: id,
        },
      });
      const oldMember = existMember.map((mem) => mem.id);
      const newMember = member.map((mem) => mem.id);
      const notExistMember = oldMember.filter((id) => !newMember.includes(id));
      if (notExistMember.length) {
        await prisma.billMembers.deleteMany({
          where: {
            id: { in: notExistMember },
          },
        });
      }
      for (let i = 0; i < member.length; i++) {
        const { name: memberName, id: memberId } = member[i];
        if (memberId) {
          await prisma.billMembers.update({
            where: {
              id: memberId,
            },
            data: {
              name: memberName,
            },
          });
        } else {
          await prisma.billMembers.create({
            data: {
              name: memberName,
              partyBillId: partyPay.id,
            },
          });
        }
      }
    });

    return { error: false, message: "Create new party pay successfully." };
  } catch (err) {
    // handleError(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
