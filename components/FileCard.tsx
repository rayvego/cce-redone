"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";

const FileCard = ({ file, handleDeleteFile, handleOpenFile, handleSelect }: FileCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // TODO: Make sure only one file is selected at a time
  const handleClick = () => {
    setIsSelected(!isSelected);
    handleSelect(); // Trigger the parent component's onSelect
  };

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <div
      className={cn("bg-white rounded-md shadow-md p-4 hover:bg-gray-200", {
        "bg-gray-100": isSelected,
      })}
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold mb-2">{file.file_name}</h3>
      <p className="text-sm text-gray-600">Created: {formatDateTime(new Date(file.createdAt)).dateTime}</p>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={handleOpenFile}>
          Open
        </Button>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => handleOpenChange(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit" onClick={handleDeleteFile} variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FileCard;