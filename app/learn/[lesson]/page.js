import React from "react";
import { LessonClient } from "../../../components/learning/LessonClient";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }) {
  const { lesson } = await params;
  return <LessonClient lessonId={lesson} />;
}
