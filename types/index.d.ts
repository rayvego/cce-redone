declare type ExecuteCodeProps = {
  language: string;
  sourceCode: string;
};

declare type HeaderBoxProps = {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
};

declare type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
};

declare type RecentFilesProps = {
  initialFiles: FileDocument[];
  userId: string;
  email: string;
};

declare type FileCardProps = {
  file: FileDocument;
  handleDeleteFile: () => Promise<void>;
  handleOpenFile: () => Promise<void>;
  // handleSelect: () => void;
};

declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

declare type CodeEditorProps = {
  users: User[];
  currentUserType: UserType;
  roomMetadata: RoomMetadata;
};

declare type LanguageSelectorProps = {
  language: string;
  onSelect: (lang: string) => void;
};

declare type OutputProps = {
  language: string;
};

declare type CreateDocumentParams = {
  userId: string;
  email: string;
  fileName: string;
};

declare type UserType = "creator" | "editor" | "viewer";

declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type ShareDocumentParams = {
  roomId: string;
  email: string;
  userType: UserType;
  updatedBy: User;
};

declare type ShareDocumentDialogProps = {
  roomId: string;
  collaborators: User[];
  creatorId: string;
  currentUserType: UserType;
};

declare type UserTypeSelectorParams = {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
};

declare type CollaboratorProps = {
  roomId: string;
  email: string;
  creatorId: string;
  collaborator: User;
  user: User;
};