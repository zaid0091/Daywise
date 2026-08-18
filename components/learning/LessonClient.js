"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RefreshCw, Award, HelpCircle } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { LESSONS } from "../../data/lessons";
import { completeLesson } from "../../lib/storage/storage";
import { useProfileStore } from "../../stores/profileStore";
import { cn } from "../../lib/utils";

export function LessonClient({ lessonId }) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const quizHeadingRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!lesson) {
    return (
      <Container className="py-12 text-center bg-black text-white">
        <h2 className="display-md font-light text-white">Lesson Not Found</h2>
        <p className="text-shade-40 mt-2">The requested tutorial does not exist.</p>
        <Button asChild variant="outline-on-dark" className="mt-4">
          <Link href="/learn">Back to Curriculum</Link>
        </Button>
      </Container>
    );
  }

  const slides = lesson.sections;
  const isQuizSlide = currentSlide === slides.length;
  const totalSteps = slides.length + 1;
  const progressPercent = Math.min(100, Math.round(((currentSlide + 1) / totalSteps) * 100));

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setQuizSubmitted(false);
      setQuizSelected(null);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizSelected === lesson.quiz.correct) {
      setCompleted(true);
      completeLesson(lessonId);
      
      const profile = useProfileStore.getState();
      profile.addXp(100);
      profile.submitActivity("lesson");
    }
  };

  const handleQuizReset = () => {
    setQuizSelected(null);
    setQuizSubmitted(false);
  };

  const renderVisualAid = () => {
    switch (lesson.id) {
      case "the-idea":
        return (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center font-mono mt-5">
            {[
              { name: "Sun", code: 0 },
              { name: "Mon", code: 1 },
              { name: "Tue", code: 2 },
              { name: "Wed", code: 3 },
              { name: "Thu", code: 4 },
              { name: "Fri", code: 5 },
              { name: "Sat", code: 6 },
            ].map((day) => (
              <div key={day.code} className="border border-hairline-dark p-3 rounded-xl bg-black/60">
                <div className="text-[11px] font-semibold text-shade-40 uppercase tracking-wider">{day.name}</div>
                <div className="text-xl font-bold text-white mt-0.5">{day.code}</div>
              </div>
            ))}
          </div>
        );
      case "anchor-days":
        return (
          <div className="border border-hairline-dark rounded-xl p-4 bg-black/60 text-xs md:text-sm space-y-2 mt-5">
            <p className="font-semibold text-aloe flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              Doomsday Reference Anchors:
            </p>
            <p className="text-shade-40 leading-relaxed">
              These memorable dates always fall on the exact same weekday: <strong className="text-white">4/4</strong>, <strong className="text-white">6/6</strong>, <strong className="text-white">8/8</strong>, <strong className="text-white">10/10</strong>, <strong className="text-white">12/12</strong>, <strong className="text-white">5/9</strong>, <strong className="text-white">9/5</strong>, <strong className="text-white">7/11</strong>, <strong className="text-white">11/7</strong>.
            </p>
          </div>
        );
      case "century-anchors":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono mt-6 text-center">
            {[
              { range: "1800s", day: "Friday", code: 5 },
              { range: "1900s", day: "Wednesday", code: 3 },
              { range: "2000s", day: "Tuesday", code: 2 },
              { range: "2100s", day: "Sunday", code: 0 },
            ].map((c) => (
              <div
                key={c.range}
                className="border border-hairline-dark hover:border-emerald-400/40 p-4 sm:p-5 rounded-2xl bg-black/80 shadow-md flex flex-col items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm text-shade-40 font-bold uppercase tracking-wider block font-mono">
                  {c.range}
                </span>
                <span className="text-lg sm:text-2xl font-bold text-white block my-2 font-heading">
                  {c.day}
                </span>
                <span className="text-xs sm:text-sm text-emerald-300 font-mono font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full block mt-1">
                  Code {c.code}
                </span>
              </div>
            ))}
          </div>
        );
      case "year-calculation":
        return (
          <div className="border border-hairline-dark bg-black/60 p-4 rounded-xl font-mono text-xs space-y-2.5 mt-5">
            <p className="font-semibold text-white uppercase tracking-wider border-b border-hairline-dark/60 pb-1.5">Conway Formula Steps:</p>
            <p className="flex justify-between text-shade-40"><span>Step A: Y / 12</span> <span className="text-white font-bold">12s division</span></p>
            <p className="flex justify-between text-shade-40"><span>Step B: Y % 12</span> <span className="text-white font-bold">Remainder</span></p>
            <p className="flex justify-between text-shade-40"><span>Step C: Remainder / 4</span> <span className="text-white font-bold">Leap years count</span></p>
            <p className="flex justify-between border-t border-hairline-dark pt-1.5 font-bold text-aloe"><span>Offset: (A + B + C) % 7</span> <span>Shift days</span></p>
          </div>
        );
      case "month-anchors":
        return (
          <div className="grid sm:grid-cols-2 gap-3.5 font-mono text-xs mt-5">
            <div className="border border-hairline-dark p-4 rounded-xl bg-black/60 space-y-1.5 text-shade-40">
              <span className="font-semibold text-white border-b border-hairline-dark pb-1.5 block">Even Months</span>
              <p>&bull; April: <strong className="text-white">4/4</strong></p>
              <p>&bull; June: <strong className="text-white">6/6</strong></p>
              <p>&bull; August: <strong className="text-white">8/8</strong></p>
              <p>&bull; October: <strong className="text-white">10/10</strong></p>
              <p>&bull; December: <strong className="text-white">12/12</strong></p>
            </div>
            <div className="border border-hairline-dark p-4 rounded-xl bg-black/60 space-y-1.5 text-shade-40">
              <span className="font-semibold text-white border-b border-hairline-dark pb-1.5 block">Odd Months</span>
              <p>&bull; March: <strong className="text-white">3/14</strong> (Pi Day)</p>
              <p>&bull; May: <strong className="text-white">5/9</strong> (9-to-5)</p>
              <p>&bull; July: <strong className="text-white">7/11</strong> (Store)</p>
              <p>&bull; September: <strong className="text-white">9/5</strong> (Reverse)</p>
              <p>&bull; November: <strong className="text-white">11/7</strong> (Reverse)</p>
            </div>
          </div>
        );
      case "putting-together":
        return (
          <div className="border border-hairline-dark bg-black/60 p-4 rounded-xl text-xs leading-relaxed space-y-1.5 mt-5 font-sans">
            <p className="font-bold text-aloe uppercase tracking-wider">Calculation Pipeline:</p>
            <p className="text-shade-40">1. Find Century Anchor &rarr; 2. Add Year Offset Drift &rarr; 3. Pinpoint Month Anchor Date &rarr; 4. Step to Target Day.</p>
          </div>
        );
      case "leap-years":
        return (
          <div className="grid grid-cols-2 gap-3 text-center font-mono mt-5 text-xs">
            <div className="border border-hairline-dark p-3.5 rounded-xl bg-black/60 text-shade-40">
              <span className="font-semibold block text-white">Common Year</span>
              <p className="mt-1">Jan anchor: <strong className="text-white">3rd</strong></p>
              <p>Feb anchor: <strong className="text-white">28th</strong></p>
            </div>
            <div className="border border-aloe/20 p-3.5 bg-aloe/5 rounded-xl text-shade-40">
              <span className="font-semibold block text-aloe">Leap Year</span>
              <p className="mt-1">Jan anchor: <strong className="text-white">4th</strong></p>
              <p>Feb anchor: <strong className="text-white">29th</strong></p>
            </div>
          </div>
        );
      case "speed-techniques":
        return (
          <div className="border border-hairline-dark bg-black/60 p-4 rounded-xl text-xs font-mono mt-5 space-y-1.5 text-shade-40">
            <p className="font-semibold text-white">Modulo 7 subtraction shortcuts:</p>
            <p className="flex justify-between"><span>+6 days shift</span> <span className="text-aloe">&rarr; &minus;1 day</span></p>
            <p className="flex justify-between"><span>+5 days shift</span> <span className="text-aloe">&rarr; &minus;2 days</span></p>
            <p className="flex justify-between"><span>+4 days shift</span> <span className="text-aloe">&rarr; &minus;3 days</span></p>
          </div>
        );
      case "mental-shortcuts":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono mt-5 text-center text-xs">
            {[
              { year: "2024", day: "Thu" },
              { year: "2025", day: "Fri" },
              { year: "2026", day: "Sat" },
              { year: "2027", day: "Sun" },
            ].map((y) => (
              <div key={y.year} className="border border-hairline-dark p-3 rounded-xl bg-black/60">
                <strong className="text-white block">{y.year}</strong>
                <span className="text-aloe font-bold block mt-0.5">{y.day}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isQuizSlide && quizHeadingRef.current) {
      quizHeadingRef.current.focus();
    }
  }, [isQuizSlide]);

  if (!mounted) return null;

  return (
    <Container className="py-8 max-w-3xl bg-black text-white">
      {/* Backlink and Title */}
      <div className="mb-6">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs text-shade-40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
          <div>
            <span className="eyebrow-cap text-shade-40">Lesson {lessonId}</span>
            <h1 className="display-md text-white font-light mt-0.5">
              {lesson.title}
            </h1>
          </div>
          <span className="text-xs text-shade-40 font-mono" aria-live="polite">
            Step {currentSlide + 1} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-aloe h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="min-h-[520px] md:min-h-[460px] flex flex-col justify-between border border-hairline-dark bg-canvas-night-elevated p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <AnimatePresence mode="wait">
          {!isQuizSlide ? (
            <motion.div
              key={`slide-${currentSlide}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <h2 className="font-heading text-lg md:text-xl font-bold border-b border-hairline-dark/60 pb-3 text-white">
                {slides[currentSlide].title}
              </h2>
              
              <div className="text-sm md:text-base leading-relaxed text-shade-40 whitespace-pre-line">
                {slides[currentSlide].text}
              </div>

              {renderVisualAid()}
            </motion.div>
          ) : (
            <motion.div
              key="quiz-slide"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-hairline-dark/60 pb-3">
                <HelpCircle className="h-5 w-5 text-aloe" />
                <h2
                  ref={quizHeadingRef}
                  tabIndex={-1}
                  className="font-heading text-lg md:text-xl font-bold text-white focus:outline-none"
                >
                  Lesson Checkpoint
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm md:text-base font-semibold text-white">{lesson.quiz.question}</p>

                <div className="grid gap-2.5">
                  {lesson.quiz.options.map((option) => {
                    const isSelected = quizSelected === option;
                    const isCorrect = option === lesson.quiz.correct;

                    let btnClass = "border-hairline-dark bg-black/60 hover:bg-white/5 text-white";
                    if (quizSubmitted) {
                      if (isSelected) {
                        btnClass = isCorrect
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-rose-500/20 border-rose-500 text-rose-300";
                      } else if (isCorrect) {
                        btnClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                      } else {
                        btnClass = "opacity-35 border-hairline-dark text-shade-60 pointer-events-none";
                      }
                    } else if (isSelected) {
                      btnClass = "border-white bg-white/10 text-white";
                    }

                    return (
                      <button
                        key={option}
                        disabled={quizSubmitted}
                        onClick={() => setQuizSelected(option)}
                        className={`w-full h-12 text-left px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${btnClass}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && isSelected && isCorrect && (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                            Correct <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </span>
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <span className="flex items-center gap-1 text-rose-400 text-xs font-mono">
                            Incorrect <XCircle className="h-4 w-4 text-rose-400" />
                          </span>
                        )}
                        {quizSubmitted && !isSelected && isCorrect && (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                            Answer <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lower navigation action row */}
        <div className="flex justify-between items-center mt-8 pt-5 border-t border-hairline-dark/60">
          <Button
            variant="outline-on-dark"
            size="sm"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </Button>

          {!isQuizSlide ? (
            <Button variant="primary" size="sm" onClick={handleNext} className="flex items-center gap-1">
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : !quizSubmitted ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleQuizSubmit}
              disabled={!quizSelected}
              className="flex items-center gap-1"
            >
              Submit Checkpoint
            </Button>
          ) : quizSelected === lesson.quiz.correct ? (
            <Button asChild variant="primary" size="sm" className="flex items-center gap-1.5 bg-aloe text-black hover:bg-aloe/90">
              <Link href="/learn">
                Complete Lesson <Award className="h-4 w-4 ml-0.5" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline-on-dark" size="sm" onClick={handleQuizReset} className="flex items-center gap-1">
              Retry Checkpoint <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Explanatory banner after submission */}
      {quizSubmitted && quizSelected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-5 rounded-xl border text-xs md:text-sm leading-relaxed ${
            quizSelected === lesson.quiz.correct
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/25 text-rose-300"
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
            {quizSelected === lesson.quiz.correct ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Checkpoint Explanation</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" />
                <span>Review Concept:</span>
              </>
            )}
          </div>
          <p className="text-shade-40">{lesson.quiz.explanation}</p>
        </motion.div>
      )}
    </Container>
  );
}
