import EventTypeForm from "@/app/components/EventTypeForm";
import { session } from "@/app/libs/session";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { use } from "react";

export default function EditEventTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const { id } = resolvedParams;

  const [email, eventTypeDoc, profileDoc] = use(
    (async () => {
      await mongoose.connect(process.env.MONGODB_URI as string);
      const sessionEmail = await session().get("email");
      const event = await EventTypeModel.findOne({ _id: id });
      const profile = await ProfileModel.findOne({ email: sessionEmail });
      return [sessionEmail, event, profile];
    })()
  );

  console.log(email);

  if (!eventTypeDoc) {
    return <div>404</div>;
  }

  return (
    <div>
      <EventTypeForm
        username={profileDoc?.username || ""}
        doc={JSON.parse(JSON.stringify(eventTypeDoc))}
      />
    </div>
  );
}
