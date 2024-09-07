import { db } from "@/lib/db";
import { createBillSchema, CreateBillSchemaType } from "@/schema/partyBill";
import { formatErrorMessage } from "@/utils/formatter";

export async function createPartyPayBill(body: CreateBillSchemaType) {
  const validatedFields = createBillSchema.safeParse(body);
  if (!validatedFields.success) {
    return { error: true, message: "Invalid body." };
  }

  const { name, date, vatFlag, serviceChargeFlag, member, billMenus, userId } =
    validatedFields.data;
  try {
    await db.$transaction(async (prisma) => {
      const partyPay = await prisma.partyBill.create({
        data: {
          name,
          date,
          vatFlag,
          serviceChargeFlag,
          userId,
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
    });
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
