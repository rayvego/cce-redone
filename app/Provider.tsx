"use client";

import React from "react";
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { getClerkUsers } from "@/lib/actions/user.actions";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      /*publicApiKey={"pk_dev_Y92eoW0hlWMHUFdxEGA5Agxpaz1JaOTflhoaJhMD3Iidk3vDggJ_H4U45VAdUGSM"}*/
      resolveUsers={async ({ userIds }) => {
        // this helps with the live collaborators
        return await getClerkUsers({ userIds });
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;