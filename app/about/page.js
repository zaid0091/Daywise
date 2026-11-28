import React from "react";
import { HelpCircle, Brain, BookOpen, Compass } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { PageHeader } from "../../components/shared/PageHeader";
import { ScrollMotion } from "../../components/shared/ScrollMotion";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About the Doomsday Method — Daywise",
  description: "Learn the mathematical principles behind John Conway's Doomsday Rule.",
};

export default function AboutPage() {
  return (
    <Container className="py-8 max-w-4xl bg-black text-white">
      <PageHeader
        eyebrow="Algorithm Primer"
        title="About the Method"
        description="The Doomsday Rule is an algorithm created by John Conway to calculate the day of the week for any calendar date mentally in seconds."
      />

      <ScrollMotion progress className="space-y-12 leading-relaxed pb-16">
        {/* Origin Section */}
        <section data-reveal-section className="space-y-4 text-left">
          <h2 data-reveal className="heading-xl text-white font-bold tracking-tight flex items-center gap-2.5">
            <Compass className="h-6 w-6 text-aloe" /> Origin & Concept
          </h2>
          <p className="text-sm md:text-base text-shade-40 leading-relaxed">
            The method was devised by the British mathematician <strong className="text-white">John Horton Conway</strong> in 1973. It works because every year has a specific day of the week (called the <em>Doomsday</em>) that falls on several memorable calendar dates across all 12 months.
          </p>
          <p className="text-sm md:text-base text-shade-40 leading-relaxed">
            Once you know the Doomsday for a given year, you can find the weekday for any date in that year by calculating the offset between that date and the closest month anchor.
          </p>
        </section>

        {/* Century Anchors Section */}
        <section data-reveal-section className="space-y-6 border-t border-hairline-dark pt-8 text-left">
          <div className="space-y-1">
            <h2 data-reveal className="heading-xl text-white font-bold tracking-tight flex items-center gap-2.5">
              <Brain className="h-6 w-6 text-aloe" /> Century Anchors
            </h2>
            <p className="text-sm text-shade-40">
              The four foundational century anchors repeat in a 400-year cycle across the Gregorian calendar:
            </p>
          </div>

          {/* Large Century Anchor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {[
              { range: "1800s", years: "1800 – 1899", day: "Friday", code: 5 },
              { range: "1900s", years: "1900 – 1999", day: "Wednesday", code: 3 },
              { range: "2000s", years: "2000 – 2099", day: "Tuesday", code: 2, isCurrent: true },
              { range: "2100s", years: "2100 – 2199", day: "Sunday", code: 0 },
            ].map((c) => (
              <div
                key={c.range}
                data-card-batch
                className={`p-5 sm:p-6 rounded-2xl border text-center flex flex-col items-center justify-between transition-[background-color,border-color,color,box-shadow,transform,opacity] ${
                  c.isCurrent
                    ? "border-emerald-400/50 bg-emerald-500/10 "
                    : "border-hairline-dark bg-canvas-night-elevated hover:border-white/20"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-sm sm:text-base font-mono font-bold text-shade-30 block ">
                    {c.range}
                  </span>
                  <span className="text-[11px] text-shade-50 font-mono block">
                    {c.years}
                  </span>
                </div>

                <strong className="text-2xl sm:text-3xl font-heading font-bold text-white my-3 block tracking-tight">
                  {c.day}
                </strong>

                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full block">
                  Code {c.code}
                </span>
              </div>
            ))}
          </div>

          {/* Month Anchors Table */}
          <div data-reveal className="pt-4">
            <Card className="border-hairline-dark bg-canvas-night-elevated overflow-hidden">
              <CardHeader className="p-4 md:p-5 border-b border-hairline-dark">
                <CardTitle className="text-xs font-bold  text-shade-40 font-mono">
                  Month Anchors Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-xs sm:text-sm text-left font-mono">
                  <thead>
                    <tr className="bg-white/5 border-b border-hairline-dark text-white text-[10px] ">
                      <th className="py-3 px-4 sm:px-6 font-semibold">Months</th>
                      <th className="py-3 px-4 sm:px-6 font-semibold">Doomsday Anchor Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-hairline-dark/60">
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">Jan / Feb</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">1/3 (Leap: 1/4) &bull; 2/28 (Leap: 2/29)</td>
                    </tr>
                    <tr className="border-b border-hairline-dark/60">
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">Mar / Apr</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">3/14 (Pi Day) &bull; 4/4 (Even Month)</td>
                    </tr>
                    <tr className="border-b border-hairline-dark/60">
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">May / Jun</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">5/9 (9-to-5) &bull; 6/6 (Even Month)</td>
                    </tr>
                    <tr className="border-b border-hairline-dark/60">
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">Jul / Aug</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">7/11 (Store) &bull; 8/8 (Even Month)</td>
                    </tr>
                    <tr className="border-b border-hairline-dark/60">
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">Sep / Oct</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">9/5 (Reverse) &bull; 10/10 (Even Month)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 sm:px-6 text-shade-30 font-semibold">Nov / Dec</td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">11/7 (Reverse) &bull; 12/12 (Even Month)</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Calculation Formula Walkthrough */}
        <section data-reveal-section data-calc-section className="space-y-4 border-t border-hairline-dark pt-8 text-left">
          <h2 data-reveal className="heading-xl text-white font-bold tracking-tight flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-aloe" /> Calculation Pipeline
          </h2>
          <p className="text-sm md:text-base text-shade-40 leading-relaxed">
            The year offset represents how many days a target year steps forward from its century anchor. Compute it using the 12-divisor rule:
          </p>

          <div data-reveal className="border border-hairline-dark bg-canvas-night-elevated p-6 md:p-8 rounded-2xl space-y-4">
            <div data-calc-step className="flex items-start gap-4">
              <span className="kbd-badge shrink-0 text-xs">
                1
              </span>
              <div className="text-sm">
                <strong className="text-white">Divide Year digits by 12:</strong> Let <em>a</em> be the division quotient (e.g. for &apos;69, 69 / 12 = <strong className="text-aloe">5</strong>).
              </div>
            </div>

            <div data-calc-step className="flex items-start gap-4">
              <span className="kbd-badge shrink-0 text-xs">
                2
              </span>
              <div className="text-sm">
                <strong className="text-white">Find remainder:</strong> Let <em>b</em> be the modulo remainder (e.g. 69 % 12 = <strong className="text-aloe">9</strong>).
              </div>
            </div>

            <div data-calc-step className="flex items-start gap-4">
              <span className="kbd-badge shrink-0 text-xs">
                3
              </span>
              <div className="text-sm">
                <strong className="text-white">Leap years in remainder:</strong> Let <em>c</em> be remainder divided by 4 (e.g. 9 / 4 = <strong className="text-aloe">2</strong>).
              </div>
            </div>

            <div data-calc-step className="flex items-start gap-4">
              <span className="kbd-badge shrink-0 text-xs">
                4
              </span>
              <div className="text-sm">
                <strong className="text-white">Sum and Modulo 7:</strong> (a + b + c) % 7 &rarr; (5 + 9 + 2) = 16 % 7 = <strong className="text-aloe">+2 offset</strong>.
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-hairline-dark text-xs text-shade-40 leading-relaxed">
              Add the offset to the century anchor to obtain the year&apos;s Doomsday. From there, shift days relative to the target month&apos;s anchor.
            </div>
          </div>
        </section>
      </ScrollMotion>
    </Container>
  );
}
