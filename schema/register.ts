import { PASSWORD_PATTERN } from "@/constant/regex";
import z from "zod";

export const registerSchema = z
  .object({
    name: z.string(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    email: z.string().email(),
    password: z
      .string()
      .refine((val) => val === "" || PASSWORD_PATTERN.test(val), {
        message: "Password does not match conditions.",
      }),
    confirmPassword: z
      .string()
      .refine((val) => val === "" || PASSWORD_PATTERN.test(val), {
        message: "Password does not match conditions.",
      }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password"],
      });
    }
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
