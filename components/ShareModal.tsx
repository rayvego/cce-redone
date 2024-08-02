"use client";

import React, { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UserTypeSelector from "@/components/UserTypeSelector";
import Collaborator from "@/components/Collaborator";
import { updateDocumentAccess } from "@/lib/actions/file.actions";

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");

  const shareDocumentHandler = async () => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    });

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className={"flex h-9 gap-1 px-4"} disabled={currentUserType !== "editor"}>
          <Image src="/icons/share.svg" className={"min-w-4 md:size-5"} alt="Share" width={20} height={20} />
          <p className={"mr-1 hidden sm:block"}>Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          "w-full max-w-[400px] rounded-xl border-none bg-white px-5 py-7 shadow-xl sm:min-w-[500px] !important"
        }
      >
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>Select which users can view and edit this project.</DialogDescription>
        </DialogHeader>

        <Label htmlFor={"email"} className={"mt-3"}>
          Email Address
        </Label>
        <div className={"flex items-center gap-3"}>
          <div className={"flex flex-1 rounded-md"}>
            <Input
              id={"email"}
              placeholder={"Enter email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={" h-11 flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 !important"}
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            className={
              "flex h-full gap-1 px-5 focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 !important"
            }
            onClick={shareDocumentHandler}
          >
            {loading ? "Sending..." : "Invite"}
          </Button>
        </div>

        <div className={"my-2 space-y-2"}>
          <ul className={"flex flex-col"}>
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                collaborator={collaborator}
                email={collaborator.email}
                user={user.info}
                creatorId={creatorId}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;