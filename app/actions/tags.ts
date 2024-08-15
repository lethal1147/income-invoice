"use server";

import { db } from "@/lib/db";

export async function getTagsByUserId(userId: string) {
  if (!userId) {
    return { error: true, message: "User id is required." };
  }

  const tags = await db.tag.findMany({
    where: {
      userId,
    },
  });

  return { error: false, message: "Get all tags for user", tags };
  try {
  } catch (err) {
    return { error: true, message: err };
  }
}
