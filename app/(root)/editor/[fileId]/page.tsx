import CodeEditor from "@/components/CodeEditor";
import Room from "@/components/Room";
import { getDocument } from "@/lib/actions/file.actions";
import { getClerkUsers, getUserInfo } from "@/lib/actions/user.actions";

const Page = async ({ params }: { params: { fileId: string } }) => {
  const user = await getUserInfo();
  const file = await getDocument({ roomId: params.fileId, userId: user.emailAddresses[0].emailAddress });

  if (!file) {
    console.error("Error fetching file");
    return;
  }

  const userIds = Object.keys(file.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const usersData = users.map((user: User) => ({
    ...user,
    userType: file.usersAccesses[user.email].includes("room:write") ? "editor" : "viewer",
  }));

  const currentUserType = file.usersAccesses[user.emailAddresses[0].emailAddress]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <section className="home">
      <div className={"home-content"}>
        <Room fileId={params.fileId}>
          <CodeEditor currentUserType={currentUserType} users={usersData} roomMetadata={file.metadata} />
        </Room>
      </div>
    </section>
  );
};

export default Page;