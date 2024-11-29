'use server'

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { uploadToCloudinary } from "@/services/cloudinary";

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
