"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  trigger?: "load" | "view";
};

const word = {
  hidden: { opacity: 0, y: -9, scale: 0.9, filter: "blur(1px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

// Serif heading whose words drop in one after another, sharpening from a slight blur.
// "\n" in `text` forces a line break.
export function SplitHeading({ text, as = "h1", className, delay = 0, trigger = "load" }: SplitHeadingProps) {
  const Tag = motion[as];
  const target = trigger === "load" ? { animate: "visible" } : { whileInView: "visible" };
  const lines = text.split("\n");

  return (
    <Tag
      className={cn("font-display font-bold", className)}
      initial="hidden"
      {...target}
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((w, wi) => (
            <motion.span
              key={wi}
              className="inline-block whitespace-pre"
              variants={word}
              transition={{ duration: 0.8, ease }}
            >
              {w + (wi < line.split(" ").length - 1 ? " " : "")}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
