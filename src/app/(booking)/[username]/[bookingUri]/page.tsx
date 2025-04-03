// app/(booking)/[username]/[bookingUri]/page.tsx
import mongoose from "mongoose";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import TimePicker from "@/app/components/TimePicker";

type PageProps = {
  params: {
    username: string;
    bookingUri: string;
  };
};

export default async function BookingPage({ params }: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const profileDoc = await ProfileModel.findOne({ username: params.username });
  if (!profileDoc) {
    return <>404 - profile not found</>;
  }

  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: params.bookingUri,
  });
  if (!etDoc) {
    return <>404 - event not found</>;
  }

  return (
    <TimePicker
      username={params.username}
      meetingUri={etDoc.uri}
      length={etDoc.length}
      bookingTimes={JSON.parse(JSON.stringify(etDoc.bookingTimes))}
    />
  );
}
