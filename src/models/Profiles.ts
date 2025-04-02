import mongoose, { model, models, Schema } from "mongoose";

interface IProfile extends mongoose.Document {
  email: string;
  username: string;
  grantId: string;
}

const ProfileSchema = new Schema<IProfile>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  grantId: { type: String, required: true },
});

export const ProfileModel =
  models?.Profile || model<IProfile>("Profile", ProfileSchema);
