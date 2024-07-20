"use server";

import { parseStringify } from "@/lib/utils";
import { LANGUAGE_VERSIONS } from "@/lib/constants";
import { getUserInfo } from "@/lib/actions/user.actions";
import connectToDatabase from "@/lib/mongoose";
import File from "@/models/File";
import User from "@/models/User";

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

export const getFile = async (fileId: string) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const file = await File.findOne({ externalUserId: user.id, _id: fileId });
    return parseStringify(file);
  } catch (error: any) {
    console.error("Error getting file: ", error);
  }
};

export const getFiles = async () => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const files = await File.find({ externalUserId: user.id });
    return parseStringify(files);
  } catch (error: any) {
    console.error("Error: ", error);
  }
};

export const createFile = async ({ fileName, fileContent }: CreateFileProps) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const file = await File.create({
      externalUserId: user.id,
      file_name: fileName,
      file_content: fileContent,
    });

    return parseStringify(file);
  } catch (error: any) {
    console.error("Failed to create file: ", error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const file = await File.findById(fileId);
    if (!file) {
      console.error("File not found");
      return null;
    }
    if (file.externalUserId !== user.id) {
      console.error("Unauthorized");
      return null;
    }
    await file.deleteOne();
    return fileId; // ! check if this works
  } catch (error: any) {
    console.error("Failed to delete file: ", error);
  }
};

export const updateFile = async ({ fileId, fileContent }: UpdateFileProps) => {
  try {
    const user = await getUserInfo();
    console.log(fileId);
    await connectToDatabase();
    const file = await File.findById(fileId);
    if (!file) {
      console.error("File not found");
      return null;
    }
    if (file.externalUserId !== user.id) {
      console.error("Unauthorized");
      return null;
    }

    file.file_content = fileContent;
    file.updatedAt = new Date();
    await file.save();
    return parseStringify(file);
  } catch (error: any) {
    console.error("Failed to update file: ", error);
  }
};

export const addCollaborator = async ({ fileId, userId, role }: AddCollaboratorProps) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const file = await File.findById(fileId);

    if (!file) {
      console.error("File not found");
      return null;
    }

    if (file.externalUserId !== user.id) {
      console.error("Unauthorized");
      return null;
    }

    const userToAdd = await User.findOne({ externalUserId: userId });
    if (!userToAdd) {
      console.error("User not found");
      return null;
    }

    const isExistingCollaborator = file.collaborators.some((collaborator) => collaborator.userId === userId);
    if (isExistingCollaborator) {
      console.error("User is already a collaborator");
      return null;
    }

    file.collaborators.push({ userId, role });

    await file.save();

    return parseStringify(userToAdd);
  } catch (error: any) {
    console.error("Error adding collaborator: ", error.message);
    return null;
  }
};

export const updateCollaborator = async ({ fileId, userIdToUpdate, newRole }: UpdateCollaboratorProps) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();

    const file = await File.findById(fileId);

    if (!file) {
      console.error("File not found");
      return null;
    }

    if (file.externalUserId !== user.id) {
      console.error("File not found");
      return null;
    }

    const collaboratorIndex = file.collaborators.findIndex((c) => c.userId === userIdToUpdate);

    if (collaboratorIndex === -1) {
      console.error("Collaborator not found");
      return null;
    }

    file.collaborators[collaboratorIndex].role = newRole;

    await file.save();
    return parseStringify(userIdToUpdate);
  } catch (error: any) {
    console.error("Error updating collaborator: ", error.message);
    return null;
  }
};

export const removeCollaborator = async ({ fileId, userIdToRemove }: RemoveCollaboratorProps) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();

    const file = await File.findById(fileId);

    if (!file) {
      console.error("File not found");
      return null;
    }

    if (file.externalUserId !== user.id) {
      console.error("Unauthorized");
      return null;
    }

    file.collaborators = file.collaborators.filter((c) => c.userId !== userIdToRemove);

    await file.save();
    return userIdToRemove;
  } catch (error: any) {
    console.error("Error deleting collaborator: ", error.message);
  }
};

export const setCollaborative = async (fileId: string) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();

    const file = await File.findById(fileId);
    if (!file) {
      console.error("File not found");
      return null;
    }

    if (file.externalUserId !== user.id) {
      console.error("Unauthorized");
      return null;
    }

    file.isCollaborative = !file.isCollaborative;

    await file.save();

    return fileId;
  } catch (error: any) {
    console.error("Error setting file as collaborative: ", error);
  }
};

export const getCollaborators = async (fileId: string) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();

    const file = await File.findById(fileId);

    if (!file) {
      console.error("File not found");
      return null;
    }

    if (file.externalUserId !== user.id) {
      console.error("File not found");
      return null;
    }

    return parseStringify(file.collaborators);
  } catch (error: any) {
    console.error("Error getting collaborators: ", error.message);
  }
};

export const collaborate = async (fileId: string) => {
  try {
    const user = await getUserInfo();

    await connectToDatabase();
    const file = await File.findById(fileId);

    if (!file) {
      console.error("File not found");
      return null;
    }

    if (!file.isCollaborative) {
      console.error("File is not collaborative");
      return null;
    }

    const role = file.collaborators.find((c) => c.userId === user.id)?.role || undefined;

    if (!role) {
      console.error("Unauthorized");
      return null;
    }

    return fileId;
  } catch (error: any) {
    console.error("Error joining file: ", error.message);
  }
};