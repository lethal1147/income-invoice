"use server";

import { db } from "@/lib/db";

export async function getTagsByUserId(userId: string) {
  if (!userId) {
    return { error: true, message: "User id is required." };
  }

  try {
    const tags = await db.tag.findMany({
      where: {
        userId,
      },
    });

    return { error: false, message: "Get all tags for user", tags };
  } catch (err) {
    return { error: true, message: err };
  }
}
