import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
  };
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

  return (
    <div>
      <h1>Booking page for {username}</h1>
      <p>Event: {eventType.title}</p>
    </div>
  );
}
