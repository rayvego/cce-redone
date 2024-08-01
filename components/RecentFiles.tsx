"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FileCard from "@/components/FileCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createDocument, deleteDocument } from "@/lib/actions/file.actions";

const RecentFiles = ({ initialFiles, userId, email }: RecentFilesProps) => {
  const [files, setFiles] = useState(initialFiles);
  const [newFileName, setNewFileName] = useState("Untitled File");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();

  const handleOpenChange = (open: boolean) => setIsCreateModalOpen(open);

  const handleOpenFile = async (fileId: string) => {
    router.push(`/editor/${fileId}`);
    console.log("Opening file: ", fileId);
  };

  const handleDeleteFile = async (fileId: string) => {
    const res = await deleteDocument(fileId);

    if (!res) {
      console.log("Failed to delete file");
      // add toast message
    }

    setFiles(files.filter((file) => file._id !== fileId));
    console.log("File deleted");
    // add toast message
  };

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFile = await createDocument({ userId: userId, email: email, fileName: newFileName });
    if (!newFile) {
      console.log("Failed to create file");
      return;
      // add toast message
    } else {
      router.push(`/editor/${newFile.id}`);
      setIsCreateModalOpen(false);
    }
  };

  // useEffect(() => {
  //   const fetchUpdatedFiles = async () => {
  //     const updatedFiles = await getFiles();
  //     setFiles(updatedFiles);
  //   };
  //
  //   fetchUpdatedFiles();
  // }, [isCreateModalOpen]);

  return (
    <div className={"flex justify-between flex-col gap-y-5"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-2xl font-semibold"}>Recent Files</h2>
        <div className={"flex gap-x-5"}>
          <Dialog open={isCreateModalOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>New File</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create File</DialogTitle>
                <DialogDescription>Create a new file</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateFile}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="file_name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="file_name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.data.length > 0 &&
          files.data.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              handleDeleteFile={() => handleDeleteFile(file.id)}
              handleOpenFile={() => handleOpenFile(file.id)}
              // handleSelect={() => handleFileSelect(file)}
            />
          ))}
      </div>
    </div>
  );
};

export default RecentFiles;