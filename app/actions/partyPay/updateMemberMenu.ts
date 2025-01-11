"use server";

import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import { formatErrorMessage } from "@/utils/formatter";

export async function updateMemberMenu(body: MemberBillSchemaType) {
  const validatedData = memberBillSchema.safeParse(body);
  if (!validatedData.success) {
    return { error: true, message: "Invalid body." };
  }
  try {
    const { data } = validatedData;
    await prisma?.$transaction(async (prisma) => {
      const existMemberMenu = await prisma.billMembers.findFirst({
        where: {
          id: data.memberId,
        },
        include: {
          memberMenus: true,
        },
      });
      const oldMemberMenus = existMemberMenu?.memberMenus.map(
        (menu) => menu.id
      );
      const newMemberMenus = data.menus.map((menu) => menu.id);
      const notExistMemberMenus = oldMemberMenus?.filter(
        (id) => !newMemberMenus.includes(id)
      );
      if (notExistMemberMenus?.length) {
        await prisma.memberMenus.deleteMany({
          where: {
            id: { in: notExistMemberMenus },
          },
        });
      }
      for (let i = 0; i < data.menus.length; i++) {
        const menu = data.menus[i];
        if (menu.id) {
          await prisma.memberMenus.update({
            data: {
              quantity: +menu.quantity,
              billMenuId: menu.menuId,
            },
            where: {
              id: menu.id,
            },
          });
        } else {
          await prisma.memberMenus.create({
            data: {
              quantity: +menu.quantity,
              billMembersId: data.memberId,
              billMenuId: menu.menuId,
            },
          });
        }
      }
    });

    return { error: false, message: "Successfully." };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
