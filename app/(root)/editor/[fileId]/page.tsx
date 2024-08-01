import CodeEditor from "@/components/CodeEditor";
import Room from "@/components/Room";
import { getDocument } from "@/lib/actions/file.actions";
import { getUserInfo } from "@/lib/actions/user.actions";

const Page = async ({ params }: { params: { fileId: string } }) => {
  const user = await getUserInfo();
  const file = await getDocument({ roomId: params.fileId, userId: user.emailAddresses[0].emailAddress });

  if (!file) {
    console.error("Error fetching file");
    return;
  }

  return (
    <section className="home">
      <div className={"home-content"}>
        <Room fileId={params.fileId}>
          <CodeEditor />
        </Room>
      </div>
    </section>
  );
};

export default Page;