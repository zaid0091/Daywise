"use client";

import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { BarChart3, LineChart as LineIcon, Award } from "lucide-react";
import { useProfileStore } from "../../stores/profileStore";
import { useMounted } from "../../lib/shared/useMounted";

export function StatsCharts() {
  const mounted = useMounted();
  const profile = useProfileStore();

  useEffect(() => {
    useProfileStore.persist.rehydrate();
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-canvas-night-elevated border border-hairline-dark rounded-2xl flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-400">
        Loading analytics…
      </div>
    );
  }

  const history = profile.history || [];

  if (history.length < 2) {
    return (
      <div className="w-full border border-hairline-dark bg-canvas-night-elevated p-10 rounded-2xl flex flex-col items-center justify-center text-center gap-4 text-zinc-600 dark:text-zinc-400 min-h-[260px]">
        <div className="p-3 bg-white/5 border border-white/10 text-white rounded-full">
          <BarChart3 className="h-7 w-7 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div className="space-y-1 max-w-sm">
          <strong className="text-white text-sm block font-bold">No training data yet</strong>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed block">
            Complete at least 2 practice sessions or daily challenges to unlock your score history and accuracy curves.
          </span>
        </div>
      </div>
    );
  }

  // Format data for Recharts (take latest 10 runs)
  const chartData = history.slice(-10).map((run, idx) => ({
    name: `Run ${idx + 1}`,
    score: run.score,
    accuracy: run.accuracy,
    speed: run.fastestSolve ? parseFloat(run.fastestSolve.toFixed(1)) : 0,
    date: run.date,
  }));

  return (
    <div className="grid md:grid-cols-2 gap-5 w-full">
      {/* 1. Score History Chart */}
      <div className="border border-hairline-dark bg-canvas-night-elevated p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400  flex items-center gap-2">
          <LineIcon className="h-4 w-4 text-white" /> Score History (pts)
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ffffff"
                strokeWidth={2.5}
                dot={{ fill: "#ffffff", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: "#ffffff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Solve Accuracy Chart */}
      <div className="border border-hairline-dark bg-canvas-night-elevated p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400  flex items-center gap-2">
          <Award className="h-4 w-4 text-aloe" /> Accuracy rate (%)
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#71717a" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />
              <Bar dataKey="accuracy" fill="#c1fbd4" radius={[6, 6, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
