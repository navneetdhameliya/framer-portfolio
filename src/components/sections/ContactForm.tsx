"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PillContent, pillClass } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Posts to /api/contact (src/app/api/contact/route.ts), which emails the inquiry
// from the studio Gmail account. Visitors always see the thank-you pop-up right
// away; delivery problems are logged on the server (Vercel → Logs), not shown.

const fieldClass =
  "w-full rounded-[10px] border border-foreground/15 bg-white/50 px-4 text-[16px] leading-[24px] text-foreground placeholder:text-foreground/35 transition-colors outline-none hover:border-foreground/30 focus:border-foreground focus:bg-white";

export function ContactForm() {
  const [thanksOpen, setThanksOpen] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      _honey: data.get("_honey"),
    };

    // Thank the visitor immediately; the email is sent in the background.
    setThanksOpen(true);
    form.reset();
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // finish sending even if the visitor leaves the page
    }).catch(() => {
      // Network failure: nothing to show the visitor; the server logs failures.
    });
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="eyebrow opacity-60">Name</span>
            <input name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your name" className={cn(fieldClass, "h-[52px]")} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow opacity-60">Email</span>
            <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" className={cn(fieldClass, "h-[52px]")} />
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className="eyebrow opacity-60">Message</span>
          <textarea
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder="Tell me about your project"
            className={cn(fieldClass, "resize-y py-3.5")}
          />
        </label>

        {/* Honeypot spam trap, hidden from people and screen readers */}
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className={pillClass}>
            <PillContent>Submit</PillContent>
          </button>
          <p className="text-[14px] leading-[20px] opacity-60">
            Or email{" "}
            <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-2">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </form>

      <ThankYouDialog open={thanksOpen} onClose={() => setThanksOpen(false)} />
    </>
  );
}

// Centered thank-you pop-up. Closes on the button, a click on the backdrop, or Escape.
function ThankYouDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="thanks-title"
            className="w-full max-w-[480px] rounded-[10px] bg-background px-6 py-12 text-center shadow-[0_24px_64px_-24px_rgba(28,30,30,0.45)] md:px-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label">Message sent</p>
            <h2 id="thanks-title" className="font-display mt-4 text-[40px] leading-[1.05] font-bold tracking-[-1.5px] md:text-[48px]">
              Thank you!
            </h2>
            <p className="mx-auto mt-4 max-w-[340px] text-[16px] leading-[24px]">
              Your message is on its way. I&apos;ll get back to you within one business day.
            </p>
            <button ref={closeRef} type="button" onClick={onClose} className={cn(pillClass, "mt-8")}>
              <PillContent>Close</PillContent>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
