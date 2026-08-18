import React from "react";
import ProfileClient from "../../components/profile/ProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile Progression — Daywise",
  description: "View your local training levels, XP scores, calendar calculation latency charts, and unlocked badges.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
