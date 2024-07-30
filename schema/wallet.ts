import { z } from "zod";

export const walletSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  balance: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  userId: z.string()
});

export type WalletSchemaType = z.infer<typeof walletSchema>;

export interface WalletSchemaTypeWithId extends WalletSchemaType {
  id: string;
}
