import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
  };
  searchParams: Record<string, string>;
};

export default async function BookingPage(props: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const username = decodeURIComponent(props.params.username);
  const bookingUri = decodeURIComponent(props.params["booking-uri"]);

  const profileDoc = await ProfileModel.findOne({ username });

  if (!profileDoc) {
    return notFound();
  }

  const eventType = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: bookingUri,
  });

  if (!eventType) {
    return notFound();
  }

  const { uri, length, bookingTimes } = eventType;

  return (
    <TimePicker
      username={username}
      meetingUri={uri}
      length={length}
      bookingTimes={JSON.parse(JSON.stringify(bookingTimes))}
    />
  );
}
