"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { GridBG } from "@/components/ui/decorative";

const STAGES = [
  "Analyzing your brief...",
  "Generating layout...",
  "Writing copy...",
  "Building components...",
  "Deploying site...",
];

export function GeneratingScreen({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStage(i), i * 700)
    );
    const done = setTimeout(() => onComplete(), STAGES.length * 700 + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] bg-bg flex flex-col items-center justify-center gap-10"
    >
      <GridBG />

      <div className="relative z-10 text-center">
        {/* Animated icon */}
        <div className="w-16 h-16 rounded-[18px] bg-accent-dim border border-accent/20 flex items-center justify-center mx-auto mb-8 relative">
          <Icons.Sparkles
            size={28}
            className="text-accent animate-float"
          />
          <div className="absolute -inset-2 rounded-[22px] border border-accent/10 animate-pulse-ring" />
        </div>

        {/* Progress steps */}
        <div className="flex flex-col gap-2.5 min-h-[160px]">
          {STAGES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, x: 10 }}
              animate={{
                opacity: i <= stage ? 1 : 0.2,
                x: i <= stage ? 0 : 10,
              }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 justify-center"
            >
              <div
                className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-300 ${
                  i < stage
                    ? "bg-success-dim border border-success/30"
                    : i === stage
                      ? "bg-accent-dim border border-accent/30"
                      : "bg-transparent border border-border"
                }`}
              >
                {i < stage && (
                  <Icons.Check size={10} className="text-success" />
                )}
                {i === stage && (
                  <div className="w-1.5 h-1.5 rounded-sm bg-accent animate-progress-pulse" />
                )}
              </div>
              <span
                className={`font-mono text-[13px] ${
                  i <= stage ? "text-text-primary" : "text-text-dim"
                } ${i === stage ? "font-medium" : "font-normal"}`}
              >
                {s}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
