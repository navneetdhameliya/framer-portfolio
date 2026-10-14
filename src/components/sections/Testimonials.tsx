"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Arrow } from "@/components/ui/Arrow";
import { Media } from "@/components/ui/Media";
import { ease } from "@/lib/motion";
import type { Testimonial } from "@/types";

const AUTOPLAY_MS = 6000;

// Photo on the left, quote on the right, segmented progress bar that fills while autoplaying.
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);

  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, items.length]);

  const current = items[index];

  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-6">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {current.image && <Media media={current.image} sizes="(min-width: 810px) 40vw, 100vw" />}
          </motion.div>
        </AnimatePresence>
        {[-1, 1].map((step) => (
          <button
            key={step}
            onClick={() => go(step)}
            aria-label={step < 0 ? "Previous testimonial" : "Next testimonial"}
            className={`absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/40 text-background backdrop-blur transition hover:bg-foreground/70 ${step < 0 ? "left-4" : "right-4"}`}
          >
            <Arrow direction={step < 0 ? "left" : "right"} className="size-4" />
          </button>
        ))}
      </div>

      <div className="flex flex-col md:pl-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease }}
          >
            <blockquote className="font-display text-[24px] leading-[1.25] font-bold tracking-[-0.5px] md:text-[26px]">
              “{current.quote}”
            </blockquote>
            <p className="label mt-8 font-medium">{current.name}</p>
            <p className="label mt-2 opacity-50">{current.role}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className="relative h-[2px] w-8 overflow-hidden bg-foreground/15"
            >
              {i === index && (
                <motion.span
                  key={index}
                  className="absolute inset-0 origin-left bg-foreground"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-foreground" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
