import { BookingTimes } from "@/app/libs/types";
import mongoose, { Model } from "mongoose";

const FromToSchema = new mongoose.Schema({
  from: String,
  to: String,
  active: Boolean,
});

export const EventTypeSchema = new mongoose.Schema(
  {
    email: String,
    title: String,
    uri: { type: String },
    description: String,
    length: Number,
    bookingTimes: new mongoose.Schema({
      monday: FromToSchema,
      tuesday: FromToSchema,
      wednesday: FromToSchema,
      thursday: FromToSchema,
      friday: FromToSchema,
      saturday: FromToSchema,
      sunday: FromToSchema,
    }),
  },
  {
    timestamps: true,
  }
);

export type EventType = {
  _id: string;
  email: string;
  title: string;
  uri: string;
  description: string;
  length: number;
  bookingTimes: BookingTimes;
  createdAt: Date;
  updatedAt: Date;
};

export const EventTypeModel =
  (mongoose.models?.EventType as Model<EventType>) ||
  mongoose.model<EventType>("EventType", EventTypeSchema);
