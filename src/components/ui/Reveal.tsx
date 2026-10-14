"use client";

import { motion } from "motion/react";
import { ease, fadeUp } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  // "load" animates once on mount (hero), "view" waits until scrolled into view.
  trigger?: "load" | "view";
};

// Fades content up 24px into place.
export function Reveal({ children, className, delay = 0, trigger = "view" }: RevealProps) {
  const target = trigger === "load" ? { animate: "visible" } : { whileInView: "visible" };
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      {...target}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
