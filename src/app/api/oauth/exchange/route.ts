import { nylas, nylasConfig } from "@/app/libs/nylas";
import { session } from "@/app/libs/session";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { ProfileModel } from "@/models/Profiles";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");

  const url = new URL(req.url as string);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No authorization code returned from Nylas", {
      status: 400,
    });
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
  const { grantId, email } = response;

  const username = email.split("@")[0];

  await mongoose.connect(process.env.MONGODB_URI as string);

  const profileDoc = await ProfileModel.findOne({ email });
  if (profileDoc) {
    profileDoc.grantId = grantId;
    profileDoc.username = username;
    await profileDoc.save();
  } else {
    await ProfileModel.create({ email, grantId, username }); // ✨
  }

  await session().set("grantId", grantId);
  await session().set("email", email);

  return redirect("/");
}
