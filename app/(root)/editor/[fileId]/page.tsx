import { getFile } from "@/lib/actions/file.actions";
import CodeEditor from "@/components/CodeEditor";
import Room from "@/components/Room";

const Page = async ({ params }: { params: { fileId: string } }) => {
  const file = await getFile(params.fileId);
  console.log(file);
  if (!file) {
    console.error("Error fetching file");
    return;
  }

  return (
    <section className="home">
      <div className={"home-content"}>
        <Room fileId={file._id}>
          {/*<CodeEditor code={file.file_content} fileId={params.fileId} />*/}
          <CodeEditor />
        </Room>
      </div>
    </section>
  );
};

export default Page;