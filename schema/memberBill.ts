import { z } from "zod";

export const memberMenusSchema = z.object({
  menuId: z.string(),
  quantity: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
});

export const memberBillSchema = z.object({
  memberId: z.string(),
  menus: z.array(memberMenusSchema).min(1),
});

export type MemberBillSchemaType = z.infer<typeof memberBillSchema>;
export type MemberMenusSchemaType = z.infer<typeof memberMenusSchema>;
