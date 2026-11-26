"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Quiet 3D perspective wrapper for the hero simulator card.
 * Tracks pointer position for subtle tilt and a neutral hairline sheen.
 */
export function Hero3DCard({ children }) {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const sheenX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const sheenY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.06), transparent 52%)`
  );

  const handlePointerMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-lg"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full"
      >
        <div className="relative rounded-2xl" style={{ transform: "translateZ(0px)" }}>
          {children}
          {isHovered && !shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              style={{ background: sheenBackground }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0 rounded-2xl"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
