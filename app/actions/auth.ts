"use server";

import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import { RegisterSchemaType, registerSchema } from "@/schema/register";
import { db } from "@/lib/db";
import { UploadApiResponse } from "cloudinary";
import { getUserByEmail } from "@/data/user";
import { loginBodySchema, LoginBodySchemaType } from "@/schema/login";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { uploadToCloudinary } from "@/services/cloudinary";

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
    console.log(err);
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid credentials!" };
        default:
          return { error: true, message: "Something went wrong!" };
      }
    }
    throw err;
  }
}

export async function register(data: FormData) {
  try {
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    const fileImage = data.get("image") as File;
    let fileUploadUrl = "";
    if (fileImage) {
      const response = await uploadToCloudinary(fileImage);
      if (response.error) throw new Error("Error on upload to cloudinary.");
      fileUploadUrl = response.url;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: true, message: "Email already in use!" };
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: fileUploadUrl,
      },
    });

    return { error: false, message: "Success." };
  } catch (error) {
    console.log(error);
    return { error: true, message: "Failed." };
  }
}

export async function signOutAction() {
  await signOut();
}
