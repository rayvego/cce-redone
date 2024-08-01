"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createFile, deleteFile, getFiles, setCollaborative } from "@/lib/actions/file.actions";
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

const RecentFiles = ({ initialFiles }: RecentFilesProps) => {
  const [files, setFiles] = useState<FileDocument[]>(initialFiles);
  const [newFileName, setNewFileName] = useState("Untitled File");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<FileDocument | null>(null);

  const router = useRouter();

  // const handleFileSelect = (file: FileDocument) => {
  //   setSelectedFile(file);
  // };

  const handleOpenChange = (open: boolean) => setIsCreateModalOpen(open);

  // TODO: Prompt user to add collaborators after setting collaborative mode
  // const handleSetCollaborative = async () => {
  //   if (!selectedFile) {
  //     return;
  //   }
  //
  //   const res = await setCollaborative(selectedFile._id);
  //
  //   if (!res) {
  //     console.error("Failed to set collaborative mode");
  //     return;
  //   }
  //
  //   console.log("Collaborative mode set on file: ", selectedFile._id);
  // };

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

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFile = await createFile({ fileName: newFileName, fileContent: "" });
    if (!newFile) {
      console.log("Failed to create file");
      return;
      // add toast message
    }

    setFiles((prevFiles) => [...prevFiles, newFile]);
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    const fetchUpdatedFiles = async () => {
      const updatedFiles = await getFiles();
      setFiles(updatedFiles);
    };

    fetchUpdatedFiles();
  }, [isCreateModalOpen]);

  return (
    <div className={"flex justify-between flex-col gap-y-5"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-2xl font-semibold"}>Recent Files</h2>
        <div className={"flex gap-x-5"}>
          {/*<Button variant={"destructive"} onClick={handleSetCollaborative}>*/}
          {/*  Collaborate*/}
          {/*</Button>*/}

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
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            handleDeleteFile={() => handleDeleteFile(file._id)}
            handleOpenFile={() => handleOpenFile(file._id)}
            // handleSelect={() => handleFileSelect(file)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentFiles;