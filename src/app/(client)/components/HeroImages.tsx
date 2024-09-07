"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "@/components/ui/imageSlider";

export default function HeroImagesSlider() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1667031519192-ba1ed681751d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hvY29sYXRlfGVufDB8MHwwfHx8MA%3D%3D",

    "https://images.unsplash.com/photo-1604514813560-1e4f5726db65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNob2NvbGF0ZXxlbnwwfDB8MHx8fDA%3D",

    "https://images.unsplash.com/photo-1542843137-8791a6904d14?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvY29sYXRlfGVufDB8MHwwfHx8MA%3D%3D",

    "https://media.istockphoto.com/id/507774175/photo/organic-dark-chocolate-candy-bar.webp?a=1&b=1&s=612x612&w=0&k=20&c=COOBZns3aeH06i7BBxWgSQec1bkC0xCNzJ3b8yQ2ua0=",

    "https://plus.unsplash.com/premium_photo-1675283825474-390ea83c0703?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2hvY29sYXRlJTIwYmFyfGVufDB8MHwwfHx8MA%3D%3D",
  ];
  return (
    <ImagesSlider
      className="h-[70vh] w-[96vw] my-2 mx-4 rounded-lg"
      images={images}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Why wait? Our 10-minute delivery service brings your favorite
          chocolates right to your door
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Order now</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
