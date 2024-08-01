"use server";

import { currentUser } from "@clerk/nextjs/server";
import { parseStringify } from "@/lib/utils";
import { redirect } from "next/navigation";

export const getUserInfo = async () => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in");
      throw new Error("No user found");
    }
    return parseStringify(clerkUser);
  } catch (error: any) {
    console.error("Error getting clerk user info: ", error);
  }
};