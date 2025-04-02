import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
  };
};

export default async function BookingPage(props: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const etDoc = await EventTypeModel.findOne({
    username: props.params.username,
    uri: props.params["booking-uri"],
  });

  return <div>{JSON.stringify(props)}</div>;
}
