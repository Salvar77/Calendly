"use client";
import { Play } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Hero = () => {
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    setShowLine(true);
  }, []);

  return (
    <section className={"text-center mt-24"}>
      <h1 className={"text-5xl font-bold mb-6 leading-tight"}>
        Scheduling{" "}
        <span
          className={
            "text-blue-600 cool-underline " + (showLine ? "show-underline" : "")
          }
        >
          made simple
        </span>
        <br />
        for people like you
      </h1>
      <p className="text-gray-600">
        Most scheduling apps are simple but ours is even more simple. <br />
        Ontop of this, it&apos;s open so you can see the code
      </p>
      <div className="mt-4 flex gap-4 justify-center">
        <Link href={"/"} className="bg-black text-white py-2 px-4 rounded-full">
          Get started for free
        </Link>
        <Link
          href={"/"}
          className="border border-gray-300 rounded-full py-2 px-4 inline-flex gap-1 items-center text-gray-800"
        >
          <Play size={16} />
          Watch video
        </Link>
      </div>
    </section>
  );
};

export default Hero;
