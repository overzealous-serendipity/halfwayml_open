import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center space-y-4 pattern-dots">
      <h1 className="text-8xl md:text-9xl font-bold">404</h1>
      <p className="text-xl md:text-3xl">LOST IN SPACE</p>
      <p className="text-sm md:text-base">{`Hmm, looks like that page doesn't exist.`}</p>
      <Image

        src="/planet.svg"
        alt="Lost planet"
        className="w-48 h-48 md:w-64 md:h-64 mt-4"
      />
      <button
        className="mt-4 bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
        onClick={() => router.push("/")}
      >
        Go Home
      </button>
    </div>
  );
}
