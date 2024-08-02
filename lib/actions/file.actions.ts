"use server";

import { getAccessType, parseStringify } from "@/lib/utils";
import { LANGUAGE_VERSIONS } from "@/lib/constants";
import { liveblocks } from "@/lib/liveblocks";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { RoomAccesses } from "@liveblocks/node";
import { redirect } from "next/navigation";

export const getCode = async ({ fileId }: { fileId: string }) => {
  try {
    const yjsDocument = await liveblocks.getYjsDocument(fileId);
    return yjsDocument.monaco?.toString();
  } catch (error: any) {
    console.error("Error getting code: ", error);
  }
};

export const executeCode = async ({ language, sourceCode }: ExecuteCodeProps) => {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: sourceCode }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "External API error");
    }

    return parseStringify(data);
  } catch (error: any) {
    console.error("Code execution error:", error);
  }
};

// ! new
export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.defaultAccesses.length === 0) {
      // meaning that the room is private
      const hasAccess = Object.keys(room.usersAccesses).includes(userId);
      if (!hasAccess) {
        // meaning that the user doesn't have access to the room
        throw new Error("You don't have access to this document");
      }
    }

    return parseStringify(room);
  } catch (error: any) {
    console.error("Error getting document: ", error);
    redirect("/");
  }
};

// export const getFile = async (fileId: string) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const file = await File.findOne({ /*externalUserId: user.id,*/ _id: fileId });
//     return parseStringify(file);
//   } catch (error: any) {
//     console.error("Error getting file: ", error);
//   }
// };

// ! new
export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error: any) {
    console.error("Error getting documents: ", error);
  }
};

// export const getFiles = async () => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const files = await File.find({ externalUserId: user.id });
//     return parseStringify(files);
//   } catch (error: any) {
//     console.error("Error: ", error);
//   }
// };

// ! new function
export const createDocument = async ({ userId, email, fileName = "Untitled" }: CreateDocumentParams) => {
  console.log(userId, email);
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: fileName,
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      defaultAccesses: [], //  delete all users and then retry if you are changing the defaultAccesses, but it's not updating...
      usersAccesses,
    });

    console.log(room.usersAccesses);
    console.log(room.defaultAccesses);

    revalidatePath("/");

    return parseStringify(room);
  } catch (error: any) {
    console.error("Error creating document: ", error);
  }
};

// export const createFile = async ({ fileName, fileContent }: CreateFileProps) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const file = await File.create({
//       externalUserId: user.id,
//       file_name: fileName,
//       file_content: fileContent,
//     });
//
//     return parseStringify(file);
//   } catch (error: any) {
//     console.error("Failed to create file: ", error);
//   }
// };

// ! new
export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    console.log(room.usersAccesses);
    console.log(roomId, email, userType, updatedBy);

    // if (room) {
    //   // ! this is how to trigger a custom notification
    //   const notificationId = nanoid();
    //
    //   await liveblocks.triggerInboxNotification({
    //     userId: email,
    //     kind: "$documentAccess", // this is a custom kind defined in Notifications.tsx
    //     subjectId: notificationId,
    //     activityData: {
    //       userType,
    //       title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
    //       updatedBy: updatedBy.name,
    //       avatar: updatedBy.avatar,
    //       email: updatedBy.email,
    //     },
    //     roomId,
    //   });
    // }

    revalidatePath(`/editor/${roomId}`);
    return parseStringify(room);
  } catch (error: any) {
    console.error("Error updating document access: ", error);
  }
};

// ! new
export const removeCollaborator = async ({ roomId, email }: { roomId: string; email: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You can't remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    revalidatePath(`/editor/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error: any) {
    console.error("Error removing collaborator: ", error);
  }
};

// ! new
export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    return roomId;
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
};

// export const deleteFile = async (fileId: string) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const file = await File.findById(fileId);
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//     if (file.externalUserId !== user.id) {
//       console.error("Unauthorized");
//       return null;
//     }
//     await file.deleteOne();
//     return fileId; // ! check if this works
//   } catch (error: any) {
//     console.error("Failed to delete file: ", error);
//   }
// };

// ! new
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/editor/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error: any) {
    console.error("Error updating document: ", error);
  }
};

// export const updateFile = async ({ fileId, fileContent }: UpdateFileProps) => {
//   try {
//     const user = await getUserInfo();
//     console.log(fileId);
//     await connectToDatabase();
//     const file = await File.findById(fileId);
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//     if (file.externalUserId !== user.id) {
//       console.error("Unauthorized");
//       return null;
//     }
//
//     file.file_content = fileContent;
//     file.updatedAt = new Date();
//     await file.save();
//     return parseStringify(file);
//   } catch (error: any) {
//     console.error("Failed to update file: ", error);
//   }
// };

// export const addCollaborator = async ({ fileId, userId, role }: AddCollaboratorProps) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const file = await File.findById(fileId);
//
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     if (file.externalUserId !== user.id) {
//       console.error("Unauthorized");
//       return null;
//     }
//
//     const userToAdd = await User.findOne({ externalUserId: userId });
//     if (!userToAdd) {
//       console.error("User not found");
//       return null;
//     }
//
//     const isExistingCollaborator = file.collaborators.some((collaborator) => collaborator.userId === userId);
//     if (isExistingCollaborator) {
//       console.error("User is already a collaborator");
//       return null;
//     }
//
//     file.collaborators.push({ userId, role });
//
//     await file.save();
//
//     return parseStringify(userToAdd);
//   } catch (error: any) {
//     console.error("Error adding collaborator: ", error.message);
//     return null;
//   }
// };
//
// export const updateCollaborator = async ({ fileId, userIdToUpdate, newRole }: UpdateCollaboratorProps) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//
//     const file = await File.findById(fileId);
//
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     if (file.externalUserId !== user.id) {
//       console.error("File not found");
//       return null;
//     }
//
//     const collaboratorIndex = file.collaborators.findIndex((c) => c.userId === userIdToUpdate);
//
//     if (collaboratorIndex === -1) {
//       console.error("Collaborator not found");
//       return null;
//     }
//
//     file.collaborators[collaboratorIndex].role = newRole;
//
//     await file.save();
//     return parseStringify(userIdToUpdate);
//   } catch (error: any) {
//     console.error("Error updating collaborator: ", error.message);
//     return null;
//   }
// };
//
// export const removeCollaborator = async ({ fileId, userIdToRemove }: RemoveCollaboratorProps) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//
//     const file = await File.findById(fileId);
//
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     if (file.externalUserId !== user.id) {
//       console.error("Unauthorized");
//       return null;
//     }
//
//     file.collaborators = file.collaborators.filter((c) => c.userId !== userIdToRemove);
//
//     await file.save();
//     return userIdToRemove;
//   } catch (error: any) {
//     console.error("Error deleting collaborator: ", error.message);
//   }
// };
//
// export const setCollaborative = async (fileId: string) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//
//     const file = await File.findById(fileId);
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     if (file.externalUserId !== user.id) {
//       console.error("Unauthorized");
//       return null;
//     }
//
//     // file.isCollaborative = !file.isCollaborative;
//
//     await file.save();
//
//     return fileId;
//   } catch (error: any) {
//     console.error("Error setting file as collaborative: ", error);
//   }
// };
//
// export const getCollaborators = async (fileId: string) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//
//     const file = await File.findById(fileId);
//
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     if (file.externalUserId !== user.id) {
//       console.error("File not found");
//       return null;
//     }
//
//     return parseStringify(file.collaborators);
//   } catch (error: any) {
//     console.error("Error getting collaborators: ", error.message);
//   }
// };
//
// export const collaborate = async (fileId: string) => {
//   try {
//     const user = await getUserInfo();
//
//     await connectToDatabase();
//     const file = await File.findById(fileId);
//
//     if (!file) {
//       console.error("File not found");
//       return null;
//     }
//
//     // if (!file.isCollaborative) {
//     //   console.error("File is not collaborative");
//     //   return null;
//     // }
//
//     const role = file.collaborators.find((c) => c.userId === user.id)?.role || undefined;
//
//     if (!role) {
//       console.error("Unauthorized");
//       return null;
//     }
//
//     return fileId;
//   } catch (error: any) {
//     console.error("Error joining file: ", error.message);
//   }
// };