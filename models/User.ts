import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  githubUsername: string;
  externalId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<UserDocument> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  githubUsername: {
    type: String,
    unique: true,
  },
  externalId: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
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

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;