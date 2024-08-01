"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { parseStringify } from "@/lib/utils";
import { redirect } from "next/navigation";
import { liveblocks } from "@/lib/liveblocks";

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

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    // This line extracts the email addresses of all users who have access to the room.
    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

    // // this is for the mentions feature, where the user types @ and then a few characters, and the app shows a list of users whose email addresses contain those characters.
    // if (text.length) {
    //   const lowerCaseText = text.toLowerCase();
    //
    //   const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));
    //
    //   return parseStringify(filteredUsers);
    // }
  } catch (error: any) {
    console.error("Error getting document users: ", error);
  }
};

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });

    const users = data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.imageUrl,
    }));

    // sort users based on the order of userIds
    // The primary goal of sortedUsers is to arrange the user information (name, avatar, etc.) in the same order as the userIds array that was originally passed to the function.
    // This is important in scenarios where the order of users matters, such as displaying a list of collaborators or showing who's actively working on a document.
    const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));
    // the output of this function is an array of user objects, where each object contains the user's id, email, name, and avatar.

    return parseStringify(sortedUsers);
  } catch (error: any) {
    console.error("Error getting Clerk users: ", error);
  }
};