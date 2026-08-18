import React from "react";
import { HomeClient } from "../components/home/HomeClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daywise — Calculate Weekdays in Your Head",
  description: "Learn Conway's Doomsday Rule to calculate the day of the week for almost any date in history — entirely in your head. Progressive lessons & interactive practice speed runs.",
  openGraph: {
    title: "Daywise — Calculate Weekdays in Your Head",
    description: "Learn Conway's Doomsday Rule to calculate the day of the week for almost any date in history — entirely in your head.",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}
