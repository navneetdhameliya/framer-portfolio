"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { RollText } from "@/components/ui/RollText";
import { contactHref, mainNav } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  // Once the page scrolls, give the bar a background so links stay readable over images.
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-foreground/10 bg-background/85 backdrop-blur-md" : "border-transparent",
      )}
      initial={{ opacity: 0, y: -150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease }}
    >
      {/* Desktop / tablet */}
      <nav className="label container-site hidden h-[72px] grid-cols-3 items-center font-medium md:grid">
        <div className="flex gap-4">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <RollText>{item.label}</RollText>
            </Link>
          ))}
        </div>
        <Link href="/" aria-label="Home" className="justify-self-center">
          <Logo className="size-7" />
        </Link>
        <div className="justify-self-end">
          <Link href={contactHref} className="group">
            <RollText>Contact us</RollText>
          </Link>
        </div>
      </nav>

      {/* Phone */}
      <div className="md:hidden">
        <div className="label container-site relative z-10 flex h-16 items-center justify-between font-medium">
          <Link href="/" aria-label="Home">
            <Logo className="size-6" />
          </Link>
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="label group font-medium">
            <RollText>{open ? "Close" : "Menu"}</RollText>
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 bg-foreground/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="absolute inset-x-0 top-0 bg-background pt-20 pb-8"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease }}
              >
                <ul className="container-site flex flex-col gap-2">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="font-display text-5xl font-bold tracking-[-2px]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={contactHref} className="font-display text-5xl font-bold tracking-[-2px]">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
