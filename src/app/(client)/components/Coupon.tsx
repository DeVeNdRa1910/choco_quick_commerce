"use client";
import React from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/TextReveal";

export default function Coupon() {
  return (
    <div className="flex items-center justify-center h-[20rem] rounded-2xl w-full">
      <TextRevealCard text="GET EXTRA DISCOUNT" revealText="     CHOCO10">
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          Hover on me too get extra discount.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}
