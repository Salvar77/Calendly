import EventTypeForm from "@/app/components/EventTypeForm";
import { session } from "@/app/libs/session";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";

export default async function EditEventTypePage({
  params,
}: {
  params: { id: string };
}) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const sessionEmail = await session().get("email");

  const eventTypeDoc = await EventTypeModel.findOne({ _id: params.id });
  if (!eventTypeDoc) {
    return <div>404 - EventType not found</div>;
  }

  const profileDoc = await ProfileModel.findOne({ email: sessionEmail });

  return (
    <div>
      <EventTypeForm
        username={profileDoc?.username || ""}
        doc={JSON.parse(JSON.stringify(eventTypeDoc))}
      />
    </div>
  );
}
