import { Clock, Info } from "lucide-react";
import { ReactNode } from "react";
import mongoose from "mongoose";
import { ProfileModel } from "@/models/Profiles";
import { EventTypeModel } from "@/models/EventType";
import { notFound } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
  params: {
    username: string;
    "booking-uri": string;
  };
};

export default async function BookingBoxLayout(props: LayoutProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const username = decodeURIComponent(props.params.username);
  const bookingUri = decodeURIComponent(props.params["booking-uri"]);

  const profileDoc = await ProfileModel.findOne({ username });

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
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: "url(/background.jpg)" }}
    >
      <div className="w-full text-center">
        <div className="inline-flex mx-auto shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-100/50 p-4 w-80 text-gray-800">
            <h1 className="text-left text-2xl font-bold mb-4 pb-2 border-b border-black/10">
              {etDoc.title}
            </h1>

            <div className="grid gap-y-4 grid-cols-[40px_1fr] text-left">
              <div className="flex justify-center">
                <Clock />
              </div>
              <div>{etDoc.length} min</div>

              <div className="flex justify-center">
                <Info />
              </div>
              <div>{etDoc.description}</div>
            </div>
          </div>

          <div className="bg-white/80 grow p-8">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
