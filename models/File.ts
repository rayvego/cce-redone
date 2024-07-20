import mongoose, { Document, Model, Schema } from "mongoose";

// export interface FileDocument extends Document {
//   externalUserId: string;
//   file_name: string;
//   file_content: string;
//   isCollaborative: boolean;
//   collaborators: { userId: string; role: "editor" | "viewer" }[];
//   createdAt: Date;
//   updatedAt: Date;
// }

const FileSchema: Schema<FileDocument> = new mongoose.Schema({
  externalUserId: {
    type: String,
    required: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  file_content: {
    type: String,
  },
  isCollaborative: {
    type: Boolean,
    default: false,
  },
  collaborators: {
    type: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ["editor", "viewer"], required: true },
      },
    ],
    default: [], // Default value for collaborators is an empty array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const File: Model<FileDocument> = mongoose.models.File || mongoose.model<FileDocument>("File", FileSchema);

export default File;