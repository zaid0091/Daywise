import React from "react";
import SettingsClient from "../../components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Daywise",
  description: "Configure your Daywise training environment, user identity details, audio logs, and accessibility preferences.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
