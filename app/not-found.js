import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <Container className="py-24 max-w-md text-center flex flex-col items-center gap-6 bg-black text-white">
      <div className="p-4 bg-white/5 border border-white/10 text-white rounded-full">
        <Calendar className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="eyebrow-cap text-shade-40">404 Exception</span>
        <h1 className="display-md font-light text-white leading-tight">
          Date Out of Bounds
        </h1>
        <p className="text-sm text-shade-40 leading-relaxed max-w-sm mx-auto">
          The date coordinates you are searching for do not exist in Conway&apos;s calendar matrix.
        </p>
      </div>

      <Button asChild variant="outline-on-dark" className="mt-2">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </Container>
  );
}
