import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { Clock, Info } from "lucide-react";
import { use } from "react";

export default function BookingPage({
  params,
}: {
  params: Promise<{ username: string; "booking-uri": string }>;
}) {
  const resolvedParams = use(params);
  const username = decodeURIComponent(resolvedParams.username);
  const bookingUri = decodeURIComponent(resolvedParams["booking-uri"]);

  const [profileDoc, foundEvent] = use(
    (async () => {
      await mongoose.connect(process.env.MONGODB_URI as string);

      const profile = await ProfileModel.findOne({ username });
      if (!profile) return [null, null];

      const event = await EventTypeModel.findOne({
        email: profile.email,
        uri: bookingUri,
      });

      return [profile, event];
    })()
  );

  if (!profileDoc || !foundEvent) {
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
