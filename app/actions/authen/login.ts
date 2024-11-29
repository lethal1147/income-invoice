"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginBodySchema, LoginBodySchemaType } from "@/schema/login";
import { AuthError } from "next-auth";

export async function login(data: LoginBodySchemaType) {
  const validatedFields = loginBodySchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: true, message: "Invalid body." };
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return {
      error: false,
      status: "success",
      message: `Welcome, ${data.email}!`,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid credentials!" };
        case "CallbackRouteError":
          return { error: true, message: "Invalid credentials!" };
        default:
          return { error: true, message: "Something went wrong!" };
      }
    }
    throw err;
  }
}
