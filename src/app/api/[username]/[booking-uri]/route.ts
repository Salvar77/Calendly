import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ProfileModel } from "@/models/Profiles";
import { EventTypeModel } from "@/models/EventType";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; "booking-uri": string } }
) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const username = decodeURIComponent(params.username);
  const bookingUri = decodeURIComponent(params["booking-uri"]);

  const profileDoc = await ProfileModel.findOne({ username });
  if (!profileDoc) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const eventType = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: bookingUri,
  });
  if (!eventType) {
    return NextResponse.json(
      { error: "Event type not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "OK",
    data: {
      username,
      bookingUri,
      eventTitle: eventType.title,
      // itd...
    },
  });
}
