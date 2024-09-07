import React from "react";
import { Meteors } from "@/components/ui/Meteors";

export default function About() {
  return (
    <div className="w-[60vw] mx-auto my-[20vh]">
      <div className="w-full relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            About Us
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
            Get ready to satisfy your sweet tooth with our premium chocolates,
            delivered in just 10 minutes! Each piece is crafted to perfection,
            offering a rich and indulgent taste that will leave you craving
            more. Whether you're celebrating a special moment or simply treating
            yourself, our chocolates are the perfect choice. Enjoy the
            convenience of fast delivery without compromising on flavor or
            quality! hassle-free!
          </p>

          <Meteors number={50} />
        </div>
      </div>
    </div>
  );
}
