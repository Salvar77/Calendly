import ProfileForm from "@/app/components/ProfileForm";
import { session } from "@/app/libs/session";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";

export default async function DashboardPage() {
  const email = await session().get("email");
  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({ email });
  return (
    <div>
      <ProfileForm existingUsername={profileDoc?.username || ""} />
    </div>
  );
}
