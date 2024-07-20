"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createFile, deleteFile, getFiles } from "@/lib/actions/file.actions";
import FileCard from "@/components/FileCard";

const RecentFiles = async ({ initialFiles }: RecentFilesProps) => {
  const [files, setFiles] = useState<FileDocument[]>(initialFiles);
  const [newFileName, setNewFileName] = useState("Untitled File");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();

  const handleOpenFile = async (fileId: string) => {
    router.push(`/editor/${fileId}`);
    console.log("Opening file: ", fileId);
  };

  const handleDeleteFile = async (fileId: string) => {
    const res = await deleteFile(fileId);

    if (!res) {
      console.log("Failed to delete file");
      // add toast message
    }

    setFiles(files.filter((file: FileDocument) => file._id !== fileId));
    console.log("File deleted");
    // add toast message
  };

  const handleCreateFile = async () => {
    const newFile = await createFile({ fileName: newFileName, fileContent: "" });
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    const fetchUpdatedFiles = async () => {
      const updatedFiles = await getFiles();
      setFiles(updatedFiles);
    };

    fetchUpdatedFiles();
  }, [newFileName]);

  return (
    <div className={"flex justify-between flex-col gap-y-5"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-2xl font-semibold"}>Recent Files</h2>
        <div className={"flex gap-x-5"}>
          <Button variant={"destructive"}>Collaborate</Button>
          <Button>New File</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              handleDeleteFile={() => handleDeleteFile(file._id)}
              handleOpenFile={() => handleOpenFile(file._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;