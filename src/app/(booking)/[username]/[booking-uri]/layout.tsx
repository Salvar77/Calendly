// src/app/(booking)/[username]/[booking-uri]/layout.tsx

import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function BookingBoxLayout({ children }: LayoutProps) {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: "url(/background.jpg)" }}
    >
      <div className="w-full text-center">
        <div className="inline-flex mx-auto shadow-md rounded-lg overflow-hidden">
          <div className="bg-white/80 grow p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
