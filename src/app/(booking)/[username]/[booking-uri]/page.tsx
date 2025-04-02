import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import { Clock, Info } from "lucide-react";
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

  const profileDoc = await ProfileModel.findOne({
    username,
  });

  if (!profileDoc) {
    return notFound();
  }

  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: bookingUri,
  });

  if (!etDoc) {
    return notFound();
  }

  return (
    <TimePicker
      username={props.params.username}
      meetingUri={etDoc.uri}
      length={etDoc.length}
      bookingTimes={JSON.parse(JSON.stringify(etDoc.bookingTimes))}
    />
  );
}
