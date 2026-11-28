"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const ANCHOR_LABELS = ["4/4", "6/6", "8/8", "10/10", "12/12", "7/11", "9/5"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function rotate3D(x, y, z, rx, ry, rz) {
  // Rotate X
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  // Rotate Y
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  // Rotate Z
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

/**
 * Full-bleed 3D perspective canvas rendering an interactive Doomsday Mod-7
 * orbital astrolabe and receding spatial dot matrix.
 */
export function Hero3DStage({ mouseRef }) {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smoothed mouse parallax
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Precompute 3D perspective floor grid points
    const gridCols = 16;
    const gridRows = 12;
    const gridPoints = [];
    for (let gx = -gridCols / 2; gx <= gridCols / 2; gx++) {
      for (let gz = 0; gz < gridRows; gz++) {
        gridPoints.push({
          x: gx * 110,
          y: 230,
          z: gz * 95 - 200,
        });
      }
    }

    // Precompute 3D floating Mod-7 particles
    const particles = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 240 + (i % 5) * 65;
      return {
        x: Math.cos(angle) * radius,
        y: ((i % 7) - 3) * 52,
        z: Math.sin(angle) * radius,
        size: 1.5 + (i % 3) * 0.8,
        emerald: false,
      };
    });

    let startTime = performance.now();

    const draw = (now) => {
      const elapsed = shouldReduceMotion ? 0 : (now - startTime) * 0.001;

      if (mouseRef?.current && !shouldReduceMotion) {
        targetTiltY = mouseRef.current.x * 0.18;
        targetTiltX = -mouseRef.current.y * 0.14;
      }
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const fov = 720;
      // Anchor the 3D astrolabe slightly right-of-center on desktop to frame the 3D card
      const cx = width >= 1024 ? width * 0.7 : width * 0.5;
      const cy = height * 0.5;

      const project = (px, py, pz, originX = cx, originY = cy) => {
        const depth = fov + pz;
        if (depth <= 40) return null;
        const scale = fov / depth;
        return {
          x: originX + px * scale,
          y: originY + py * scale,
          scale,
          z: pz,
        };
      };

      // 1. Receding 3D perspective floor dot-grid (quiet almanac lattice)
      for (let i = 0; i < gridPoints.length; i++) {
        const gp = gridPoints[i];
        const r = rotate3D(gp.x, gp.y, gp.z, 0.12 + currentTiltX * 0.35, currentTiltY * 0.35, 0);
        const p = project(r.x, r.y, r.z, width * 0.5, height * 0.55);
        if (!p) continue;
        const fade = Math.max(0, Math.min(1, 1 - (p.z + 200) / 1150));
        ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * fade})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, 1.5 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Three concentric 3D orbital rings
      const rings = [
        { radius: 220, rx: 1.05 + currentTiltX, ry: elapsed * 0.16 + currentTiltY, rz: 0.25, color: "rgba(255, 255, 255, 0.10)", dash: [] },
        { radius: 295, rx: 0.72 + currentTiltX * 0.8, ry: -elapsed * 0.11 + currentTiltY, rz: -0.45, color: "rgba(255, 255, 255, 0.07)", dash: [4, 6] },
        { radius: 365, rx: 1.25 + currentTiltX * 0.6, ry: elapsed * 0.07 + currentTiltY, rz: 0.65, color: "rgba(255, 255, 255, 0.05)", dash: [] },
      ];

      rings.forEach((ring) => {
        const segments = 72;
        ctx.save();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash(ring.dash);
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const x = Math.cos(theta) * ring.radius;
          const y = 0;
          const z = Math.sin(theta) * ring.radius;
          const r = rotate3D(x, y, z, ring.rx, ring.ry, ring.rz);
          const p = project(r.x, r.y, r.z);
          if (!p) continue;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // 3. Collect depth-sorted 3D nodes (7 Doomsday anchors + 7 weekday nodes + particles)
      const renderables = [];

      // 7 Doomsday Anchor nodes on inner ring
      for (let i = 0; i < 7; i++) {
        const theta = (i / 7) * Math.PI * 2 + elapsed * 0.22;
        const r = rotate3D(
          Math.cos(theta) * 220,
          0,
          Math.sin(theta) * 220,
          1.05 + currentTiltX,
          currentTiltY,
          0.25
        );
        const p = project(r.x, r.y, r.z);
        if (p) {
          renderables.push({
            type: "anchor",
            label: ANCHOR_LABELS[i],
            ...p,
          });
        }
      }

      // 7 Weekday nodes on middle ring
      for (let i = 0; i < 7; i++) {
        const theta = (i / 7) * Math.PI * 2 - elapsed * 0.15;
        const r = rotate3D(
          Math.cos(theta) * 295,
          0,
          Math.sin(theta) * 295,
          0.72 + currentTiltX * 0.8,
          currentTiltY,
          -0.45
        );
        const p = project(r.x, r.y, r.z);
        if (p) {
          renderables.push({
            type: "weekday",
            label: WEEKDAY_LABELS[i],
            ...p,
          });
        }
      }

      // Ambient 3D particles
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const r = rotate3D(
          pt.x,
          pt.y,
          pt.z,
          currentTiltX * 0.9,
          elapsed * 0.08 + currentTiltY,
          0
        );
        const p = project(r.x, r.y, r.z);
        if (p) {
          renderables.push({
            type: "particle",
            size: pt.size,
            emerald: pt.emerald,
            ...p,
          });
        }
      }

      // Painter's algorithm sort (back to front)
      renderables.sort((a, b) => b.z - a.z);

      for (let i = 0; i < renderables.length; i++) {
        const item = renderables[i];
        const depthAlpha = Math.max(0.15, Math.min(1, 1 - (item.z + 180) / 720));

        if (item.type === "particle") {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * depthAlpha})`;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size * item.scale, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === "anchor") {
          const rad = 4.2 * item.scale;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * depthAlpha})`;
          ctx.beginPath();
          ctx.arc(item.x, item.y, rad, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * depthAlpha})`;
          ctx.font = `500 ${Math.max(10, Math.round(12 * item.scale))}px Manrope, system-ui, sans-serif`;
          ctx.fillText(item.label, item.x + rad + 5, item.y + 3);
        } else if (item.type === "weekday") {
          const rad = 3 * item.scale;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * depthAlpha})`;
          ctx.beginPath();
          ctx.arc(item.x, item.y, rad, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(161, 161, 170, ${0.7 * depthAlpha})`;
          ctx.font = `400 ${Math.max(9, Math.round(11 * item.scale))}px Manrope, system-ui, sans-serif`;
          ctx.fillText(item.label, item.x + rad + 4, item.y + 3);
        }
      }

      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [mouseRef, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-60 pointer-events-none"
    />
  );
}

