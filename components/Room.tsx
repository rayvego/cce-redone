"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import React from "react";

const Room = ({ children, fileId }: { children: React.ReactNode; fileId: string }) => {
  return (
    <RoomProvider id={fileId}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;