import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { Clock, Info } from "lucide-react";

export default async function BookingPage({
  params,
}: {
  params: { username: string; "booking-uri": string };
}) {
  // Pobieramy parametry
  const username = decodeURIComponent(params.username);
  const bookingUri = decodeURIComponent(params["booking-uri"]);

  // Łączymy się z bazą w obrębie tego serwerowego komponentu
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Znajdujemy profil
  const profileDoc = await ProfileModel.findOne({ username });
  if (!profileDoc) {
    return notFound();
  }

  // I event
  const foundEvent = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: bookingUri,
  });
  if (!foundEvent) {
    return notFound();
  }

  const { uri, length, bookingTimes, title, description } = foundEvent;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-blue-100/50 p-4 w-80 text-gray-800 mb-6 rounded shadow">
        <h1 className="text-left text-2xl font-bold mb-4 pb-2 border-b border-black/10">
          {title}
        </h1>

        <div className="grid gap-y-4 grid-cols-[40px_1fr] text-left">
          <div className="flex justify-center">
            <Clock />
          </div>
          <div>{length} min</div>

          <div className="flex justify-center">
            <Info />
          </div>
          <div>{description}</div>
        </div>
      </div>

      <TimePicker
        username={username}
        meetingUri={uri}
        length={length}
        bookingTimes={JSON.parse(JSON.stringify(bookingTimes))}
      />
    </div>
  );
}
