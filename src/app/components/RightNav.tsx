"use client";

import Link from "next/link";

export default function RightNav({ email }: { email: string }) {
  const hasLoggedOut =
    typeof window !== "undefined" && location.href.includes("logged-out");

  if (email && !hasLoggedOut) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="btn-blue">
          Dashboard
        </Link>
        <Link href="/api/logout/">Wyloguj</Link>
      </nav>
    );
  } else {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/api/auth">Sign in</Link>
        <Link
          href="/about"
          className="bg-blue-600 text-white py-2 px-4 rounded-full"
        >
          Get started
        </Link>
      </nav>
    );
  }
}
