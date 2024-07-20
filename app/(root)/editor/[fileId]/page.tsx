import { getFile, updateFile } from "@/lib/actions/file.actions";
import CodeEditor from "@/components/CodeEditor";

const Page = async ({ params }: { params: { fileId: string } }) => {
  const file = await getFile(params.fileId);
  if (!file) {
    console.error("Error fetching file");
    return;
  }

  return (
    <section className="home">
      <div className={"home-content"}>
        <CodeEditor code={file.file_content} fileId={params.fileId} />
      </div>
    </section>
  );
};

export default Page;