import React from "react";
import { ReviewClient } from "../../../components/review/ReviewClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review — Daywise",
  description: "Solve the dates you missed, scheduled over the coming days.",
};

export default function ReviewPage() {
  return <ReviewClient />;
}
