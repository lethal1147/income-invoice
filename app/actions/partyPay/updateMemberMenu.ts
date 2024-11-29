"use server";

import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import { formatErrorMessage } from "@/utils/formatter";

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
