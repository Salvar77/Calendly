"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingTimes, WeekdayName } from "../libs/types";
import { weekdaysShortNames } from "../libs/shared";
import { useState, useEffect } from "react";
import {
  addDays,
  addMinutes,
  addMonths,
  endOfDay,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isFuture,
  isLastDayOfMonth,
  isToday,
  startOfDay,
  subMonths,
} from "date-fns";
import clsx from "clsx";
import Link from "next/link";
import axios from "axios";
import { TimeSlot } from "nylas";
import { BounceLoader } from "react-spinners";

type TimePickerProps = {
  bookingTimes: BookingTimes;
  length: number;
  meetingUri: string;
  username: string;
};

export default function TimePicker({
  bookingTimes,
  length,
  meetingUri,
  username,
}: TimePickerProps) {
  const currentDate = new Date();
  const [activeMonthDate, setActiveMonthDate] = useState(currentDate);
  const [activeMonthIndex, setActiveMonthIndex] = useState(
    activeMonthDate.getMonth()
  );
  const [activeYear, setActiveYear] = useState(activeMonthDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<null | Date>(null);
  const [busySlots, setBusySlots] = useState<TimeSlot[]>([]);
  const [busySlotsLoaded, setBusySlotsLoaded] = useState(false);

  useEffect(() => {
    setBusySlots([]);
    setBusySlotsLoaded(false);
    if (selectedDay) {
      const params = new URLSearchParams();
      params.set("username", username);
      params.set("from", startOfDay(selectedDay).toISOString());
      params.set("to", endOfDay(selectedDay).toISOString());
      axios.get(`/api/busy?` + params.toString()).then((response) => {
        setBusySlots(response.data);
        setBusySlotsLoaded(true);
      });
    }
  }, [selectedDay, username]);

  // function withinBusySlots(datetime: Date) {
  //   const bookingFrom = time;
  //   const bookingTo = addMinutes(new Date(time), length);

  //   let result = false;

  //   for (let busySlot of busySlots) {
  //     const busyFrom = new Date(parseInt(busySlot.startTime) * 1000);
  //     const busyTo = new Date(parseInt(busySlot.endTime) * 1000);
  //     if (
  //       isAfter(bookingTo, busyFrom, busySlot, bookingFrom, bookingTo) &&
  //       isBefore(bookingTo, busyTo)
  //     ) {
  //       return true;
  //     }
  //     if (isAfter(bookingTo, busyFrom) && isBefore(bookingTo, busyTo)) {
  //       return true;
  //     }
  //     if (isEqual(bookingFrom, busyFrom)) {
  //       return true;
  //     }
  //     if (isEqual(bookingTo, busyTo)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }

  const firstDayOfCurrentMonth = new Date(activeYear, activeMonthIndex, 1);
  const firstDayOfCurrentMonthWeekdayIndex = getDay(firstDayOfCurrentMonth);
  const emptyDaysCount =
    firstDayOfCurrentMonthWeekdayIndex === 0
      ? 6
      : firstDayOfCurrentMonthWeekdayIndex - 1;
  const emptyDaysArr = new Array(emptyDaysCount).fill(null, 0, emptyDaysCount);
  const daysNumbers = [firstDayOfCurrentMonth];

  do {
    const lastAddedDay = daysNumbers[daysNumbers.length - 1];
    daysNumbers.push(addDays(lastAddedDay, 1));
  } while (!isLastDayOfMonth(daysNumbers[daysNumbers.length - 1]));

  let selectedDayConfig = null;
  const bookingHours: Date[] = [];

  if (selectedDay) {
    const weekdayNameIndex = format(
      selectedDay,
      "EEEE"
    ).toLowerCase() as WeekdayName;

    selectedDayConfig = bookingTimes?.[weekdayNameIndex];

    if (selectedDayConfig) {
      const [hoursFrom, minutesFrom] = selectedDayConfig.from.split(":");
      const [hoursTo, minutesTo] = selectedDayConfig.to.split(":");

      const selectedDayFrom = new Date(selectedDay);
      selectedDayFrom.setHours(parseInt(hoursFrom));
      selectedDayFrom.setMinutes(parseInt(minutesFrom));
      selectedDayFrom.setSeconds(0);
      selectedDayFrom.setMilliseconds(0);

      const selectedDayTo = new Date(selectedDay);
      selectedDayTo.setHours(parseInt(hoursTo));
      selectedDayTo.setMinutes(parseInt(minutesTo));
      selectedDayTo.setSeconds(0);
      selectedDayTo.setMilliseconds(0);

      let slot = new Date(selectedDayFrom);

      while (isBefore(slot, selectedDayTo)) {
        bookingHours.push(new Date(slot)); // ważne!
        slot = addMinutes(slot, length);
      }
    }
  }

  function prevMonth() {
    setActiveMonthDate((prev) => {
      const newActiveMonthDate = subMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());

      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function nextMonth() {
    setActiveMonthDate((prev) => {
      const newActiveMonthDate = addMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());

      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function handleDayClick(day: Date) {
    setSelectedDay(day);
  }

  return (
    <div className="flex">
      <div className="p-8">
        <div className="flex items-center">
          <span className="grow">
            {format(new Date(activeYear, activeMonthIndex, 1), "MMMM")}{" "}
            {activeYear}
          </span>
          <div></div>
          <button onClick={prevMonth}>
            <ChevronLeft />
          </button>
          <button onClick={nextMonth}>
            <ChevronRight />
          </button>
        </div>
        <div className="inline-grid gap-2 grid-cols-7 mt-2">
          {weekdaysShortNames.map((weekdayShortName) => (
            <div
              className="text-center uppercase text-sm text-gray-500 font-bold"
              key={weekdayShortName}
            >
              {weekdayShortName}
            </div>
          ))}
          {emptyDaysArr.map((_, index) => (
            <div key={`slot-${index}`} />
          ))}
          {daysNumbers.map((n) => {
            const weekdayNameIndex: WeekdayName = format(
              n,
              "EEEE"
            ).toLowerCase() as WeekdayName;
            const weekdayConfig = bookingTimes?.[weekdayNameIndex];
            const isActiveInBookingTimes = weekdayConfig?.active;
            const canBeBooked = isFuture(n) && isActiveInBookingTimes;
            const isSelected = selectedDay && isEqual(n, selectedDay);

            return (
              <div
                key={n.toISOString()}
                className="text-center text-sm text-gray-400 font-bold "
              >
                <button
                  disabled={!canBeBooked}
                  onClick={() => handleDayClick(n)}
                  className={clsx(
                    " w-8 h-8 rounded-full inline-flex items-center justify-center",
                    canBeBooked && !isSelected
                      ? "bg-blue-100 text-blue-700"
                      : "",
                    isToday(n) && !isSelected
                      ? "bg-gray-200 text-gray-500"
                      : "",
                    isSelected ? "bg-blue-500 text-white" : ""
                  )}
                >
                  {format(n, "d")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {selectedDay && busySlotsLoaded && (
        <div className="pt-8 pl-2 overflow-auto pr-8 w-48">
          <p className="text-left text-sm">
            {format(selectedDay, "EEEE, MMMM d")}
          </p>
          <div className="grid gap-2 mt-2 max-h-52">
            {!busySlotsLoaded && (
              <div className="flex justify-center py-4">
                <BounceLoader speedMultiplier={2} color="#3B82F6" />
              </div>
            )}
            {busySlotsLoaded &&
              bookingHours.map((bookingTime) => (
                <div key={bookingTime.toISOString()}>
                  <Link
                    href={`/${username}/${meetingUri}/${bookingTime.toISOString()}`}
                    className="w-full block border-2 rounded-lg border-blue-600 text-blue-600 font-semibold"
                  >
                    {format(bookingTime, "HH:mm")}
                  </Link>
                </div>
              ))}
            <div className="mb-8">&nbsp;</div>
          </div>
        </div>
      )}
    </div>
  );
}
