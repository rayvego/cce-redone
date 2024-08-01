"use client";

import React from "react";
import { LiveblocksProvider, ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      /*publicApiKey={"pk_dev_Y92eoW0hlWMHUFdxEGA5Agxpaz1JaOTflhoaJhMD3Iidk3vDggJ_H4U45VAdUGSM"}*/
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;