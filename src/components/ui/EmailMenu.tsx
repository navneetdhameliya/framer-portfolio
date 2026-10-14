"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { emailSubject, siteConfig } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// mailto: only works when the visitor has a desktop mail app set up, so the
// trigger opens a menu with a Gmail compose link and a copy-address option.
const to = siteConfig.email;
const subject = encodeURIComponent(emailSubject);
const options = [
  { label: "Gmail", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`, newTab: true },
];

type EmailMenuProps = {
  children: React.ReactNode;
  className?: string; // classes for the trigger button
  align?: "left" | "center" | "right";
  placement?: "top" | "bottom";
};

export function EmailMenu({ children, className, align = "left", placement = "bottom" }: EmailMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(to);
    } catch {
      // Clipboard can be blocked (e.g. non-secure context); the address is still shown in the menu.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const position = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  }[align];

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: placement === "bottom" ? -6 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === "bottom" ? -6 : 6 }}
            transition={{ duration: 0.25, ease }}
            className={cn(
              "absolute z-50 w-[240px] rounded-[10px] font-normal normal-case tracking-normal border border-foreground/10 bg-background p-1.5 text-left text-foreground shadow-[0_12px_32px_-12px_rgba(28,30,30,0.25)]",
              position,
              placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            )}
          >
            <p className="px-3 pt-2 pb-1 text-[12px] leading-[16px] opacity-55">{to}</p>
            {options.map((o) => (
              <a
                key={o.label}
                role="menuitem"
                href={o.href}
                target={o.newTab ? "_blank" : undefined}
                rel={o.newTab ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="label flex items-center justify-between rounded-[6px] px-3 py-2.5 font-medium hover:bg-foreground/5"
              >
                {o.label}
                <span aria-hidden="true" className="opacity-40">↗</span>
              </a>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={copy}
              className="label flex w-full items-center justify-between rounded-[6px] px-3 py-2.5 font-medium hover:bg-foreground/5"
            >
              {copied ? "Copied" : "Copy email"}
              <span aria-hidden="true" className="opacity-40">{copied ? "✓" : "⧉"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
