import z from "zod";

export const paymentMethod = ["promptpay", "bank", "qrcode"] as const;
export type PaymentMethodType = "promptpay" | "bank" | "qrcode";

export const billMenu = z.object({
  quantity: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  pricePerItem: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  name: z.string().min(1),
});

export const billMember = z.object({ name: z.string() });

export const createBillSchema = z.object({
  name: z.string(),
  date: z.date(),
  userId: z.string(),
  vatFlag: z.boolean(),
  paymentMethod: z.enum(paymentMethod),
  qrcode: z
    .union([z.string(), z.instanceof(File, { message: "Invalid file format" })])
    .optional(),
  bank: z.string().optional(),
  bankNumber: z.string().optional(),
  promptpay: z.string().optional(),
  serviceChargeFlag: z.boolean(),
  billMenus: z.array(billMenu).min(1),
  member: z.array(billMember).min(1),
});

export type CreateBillSchemaType = z.infer<typeof createBillSchema>;
export type BillMenuSchemaType = z.infer<typeof billMenu>;
export type BillMemberSchemaType = z.infer<typeof billMember>;
