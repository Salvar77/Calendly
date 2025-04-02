import { nylas } from "@/app/libs/nylas";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { TimeSlot } from "nylas";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = decodeURIComponent(url.searchParams.get("username") || "");
    const from = new Date(url.searchParams.get("from") || "");
    const to = new Date(url.searchParams.get("to") || "");

    await mongoose.connect(process.env.MONGODB_URI as string);
    const profileDoc = await ProfileModel.findOne({ username });

    if (!profileDoc || !profileDoc.grantId) {
      return Response.json("invalid username or missing grantId", {
        status: 404,
      });
    }

    const nylasBusyResult = await nylas.calendars.getFreeBusy({
      identifier: profileDoc.grantId,
      requestBody: {
        emails: [profileDoc.email],
        startTime: Math.round(from.getTime() / 1000),
        endTime: Math.round(to.getTime() / 1000),
      },
    });

    let busySlots: TimeSlot[] = [];

    if (nylasBusyResult.data?.[0]) {
      const slots = nylasBusyResult.data[0].timeSlots as TimeSlot[];
      busySlots = slots.filter((slot) => slot.status === "busy");
    }

    return Response.json(busySlots);
  } catch (err: any) {
    console.error("Błąd w /api/busy:", err);
    return Response.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
