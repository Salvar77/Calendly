"use client";
import TimeSelect from "@/app/components/TimeSelect";
import { FormEvent, useState } from "react";
import { BookingTimes, WeekdayName } from "../libs/types";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import { EventType } from "@/models/EventType";
import EventTypeDelete from "./EventTypeDelete";
import { weekdaysNames } from "../libs/shared";

export default function EventTypeForm({
  doc,
  username = "",
}: {
  doc?: EventType;
  username?: string;
}) {
  const [title, setTitle] = useState(doc?.title || "");
  const [description, setDescription] = useState(doc?.description || "");
  const [length, setLength] = useState(doc?.length || 30);
  const [bookingTimes, setBookingTimes] = useState<BookingTimes>(
    doc?.bookingTimes || {}
  );
  const router = useRouter();

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const id = doc?._id;
    const request = id ? axios.put : axios.post;
    const data = {
      title,
      description,
      length,
      bookingTimes,
    };

    const response = await request("/api/event-types", { ...data, id });
    if (response.data) {
      router.push("/dashboard/event-types");
    }
  };

  function handleBookingTimeChange(
    day: WeekdayName,
    val: string | boolean,
    prop: "from" | "to" | "active"
  ) {
    setBookingTimes((oldBookingTimes) => {
      const newBookingTimes: BookingTimes = { ...oldBookingTimes };
      if (!newBookingTimes[day]) {
        newBookingTimes[day] = { from: "00:00", to: "00:00", active: false };
      }
      newBookingTimes[day] = { ...newBookingTimes[day], [prop]: val };
      return newBookingTimes;
    });
  }

  return (
    <form className="mt-4 p-2 bg-gray-200 rounded-lg" onSubmit={handleSubmit}>
      {doc && (
        <p className="my-2 text-sm text-gray-500">
          {process.env.NEXT_PUBLIC_URL}/{username}/{doc.uri}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>
            <span className="text-black">title</span>
            <input
              className="bg-white"
              type="text"
              placeholder="title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </label>
          <label>
            <span>description</span>
            <textarea
              className="bg-white"
              placeholder="description"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            ></textarea>
          </label>
          <label>
            <span>event length (minutes)</span>
            <input
              className="bg-white"
              type="number"
              placeholder="30"
              value={length}
              onChange={(ev) => setLength(parseInt(ev.target.value))}
            />
          </label>
        </div>
        <div>
          <span className="label">availability</span>
          <div className="grid  gap-2 ">
            {weekdaysNames.map((day) => {
              const active = bookingTimes?.[day]?.active;
              return (
                <div key={day} className="grid grid-cols-2 gap-2 items-center">
                  <label className="flex gap-1 !mb-0 !p-0">
                    <input
                      type="checkbox"
                      value={1}
                      checked={bookingTimes?.[day]?.active}
                      onChange={(ev) =>
                        handleBookingTimeChange(
                          day,
                          ev.target.checked,
                          "active"
                        )
                      }
                    />
                    {day}
                  </label>
                  <div
                    className={clsx(
                      "inline-flex gap-2 items-center ml-2",
                      active ? "" : "opacity-40"
                    )}
                  >
                    {" "}
                    <TimeSelect
                      value={bookingTimes?.[day]?.from || "00:00"}
                      onChange={(val) =>
                        handleBookingTimeChange(day, val, "from")
                      }
                      step={30}
                    />
                    <span>-</span>
                    <TimeSelect
                      value={bookingTimes?.[day]?.to || "00:00"}
                      onChange={(val) =>
                        handleBookingTimeChange(day, val, "to")
                      }
                      step={30}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        {doc && <EventTypeDelete id={doc._id as string} />}
        <button type="submit" className="btn-blue !px-8">
          Save
        </button>
      </div>
    </form>
  );
}
