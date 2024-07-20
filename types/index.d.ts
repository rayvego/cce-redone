declare type ExecuteCodeProps = {
  language: string;
  sourceCode: string;
};

declare type CreateFileProps = {
  fileName: string;
  fileContent: string;
};

declare type UpdateFileProps = {
  fileId: string;
  fileContent: string;
};

declare type AddCollaboratorProps = {
  fileId: string;
  userId: string;
  role: "editor" | "viewer";
};

declare type UpdateCollaboratorProps = {
  fileId: string;
  userIdToUpdate: string;
  newRole: "editor" | "viewer";
};

declare type RemoveCollaboratorProps = {
  fileId: string;
  userIdToRemove: string;
};

declare type HeaderBoxProps = {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
};

declare type ClerkUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
};

declare type User = {
  _id: string;
  username: string;
  email: string;
  githubUsername: string;
  externalId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

declare type FileDocument = {
  _id: string;
  externalUserId: string;
  file_name: string;
  file_content: string;
  isCollaborative: boolean;
  collaborators: { userId: string; role: "editor" | "viewer" }[];
  createdAt: Date;
  updatedAt: Date;
};

declare type RecentFilesProps = {
  initialFiles: FileDocument[];
};

declare type FileCardProps = {
  file: FileDocument;
  handleDeleteFile: () => Promise<void>;
  handleOpenFile: () => Promise<void>;
};