"use server";

import { currentUser } from "@clerk/nextjs/server";
import { parseStringify } from "@/lib/utils";

export const getUserInfo = async () => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("No user found");
    }
    return parseStringify(clerkUser);
  } catch (error: any) {
    console.error("Error getting clerk user info: ", error);
  }
};