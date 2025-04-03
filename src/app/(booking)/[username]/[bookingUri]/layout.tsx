// app/(booking)/[username]/[bookingUri]/layout.tsx

import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: {
    username: string;
    bookingUri: string;
  };
};

export default function BookingBoxLayout({ children }: LayoutProps) {
  // Zero zapytań do bazy – layout tylko wyświetla UI (np. tło, ramkę)

  return (
    <div
      className="flex items-center h-screen bg-cover"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="w-full text-center">
        <div className="inline-flex mx-auto shadow-md rounded-lg overflow-hidden">
          {/* Lewy box, jeśli chcesz np. tytuł itp. (ale statyczny) */}
          <div className="bg-blue-100/50 p-8 w-80 text-gray-800">
            {/* Możesz tu wrzucić cokolwiek, ale bez asynchronicznego fetchu */}
            <h2 className="text-xl">Some static layout content</h2>
          </div>

          {/* Prawy box – wstawiamy children, w którym jest strona */}
          <div className="bg-white/80 grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
