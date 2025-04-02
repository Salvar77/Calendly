import { nylas } from "@/app/libs/nylas";
import { BookingModel } from "@/models/Bookings";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profiles";
import { addMinutes } from "date-fns";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

type JsonData = {
  guestName: string;
  guestEmail: string;
  guestNotes: string;
  username: string;
  bookingUri: string;
  bookingTime: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: JsonData = await req.json();
    const { guestEmail, guestName, guestNotes, bookingTime } = data;
    const username = decodeURIComponent(data.username);

    await mongoose.connect(process.env.MONGODB_URI as string);
    const profileDoc = await ProfileModel.findOne({ username });

    if (!profileDoc || !profileDoc.grantId) {
      return Response.json("invalid profile", { status: 404 });
    }

    const etDoc = await EventTypeModel.findOne({
      email: profileDoc.email,
      uri: data.bookingUri,
    });

    if (!etDoc) {
      return Response.json("invalid event type", { status: 404 });
    }

    await BookingModel.create({
      guestName,
      guestNotes,
      guestEmail,
      when: new Date(bookingTime),
      eventTypeId: etDoc._id,
    });

    const startDate = new Date(bookingTime);

    await nylas.events.create({
      identifier: profileDoc.grantId,
      requestBody: {
        title: etDoc.title,
        description: etDoc.description,
        when: {
          startTime: Math.round(startDate.getTime() / 1000),
          endTime: Math.round(
            addMinutes(startDate, etDoc.length).getTime() / 1000
          ),
        },
        conferencing: {
          autocreate: {},
          provider: "Google Meet",
        },
        participants: [
          {
            name: guestName,
            email: guestEmail,
            status: "yes",
          },
        ],
      },
      queryParams: {
        calendarId: etDoc.email,
      },
    });

    return Response.json(true, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
  }
}
