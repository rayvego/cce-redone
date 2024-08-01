import { liveblocks } from "@/lib/liveblocks";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserColor } from "@/lib/utils";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // we want to form the user in such a way that liveblocks accepts it
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email, // identify the user by their email
      groupIds: [], // set to an empty array
      // ! keeping it empty as we are checking if user has permission on our own while entering a room
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}