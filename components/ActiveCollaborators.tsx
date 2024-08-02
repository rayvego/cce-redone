import React from "react";
import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaborators = () => {
  const others = useOthers(); // to get the list of active collaborators

  // ? where did we set the color for user?
  const collaborators = others.map((other) => other.info);

  return (
    <ul className={"flex p-1 items-center justify-end -space-x-3 overflow-hidden"}>
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id}>
          <Image
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className={"inline-block size-8 rounded-full"}
            style={{ border: `3px solid ${color}` }}
          />
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaborators;