"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RollText } from "@/components/ui/RollText";
import { footerLinks, siteConfig } from "@/data/site";
import { ease } from "@/lib/motion";

export function Footer() {
  return (
    <footer className="container-site relative pt-20">
      {/* Divider draws in from the left when it scrolls into view */}
      <motion.div
        className="h-px origin-left bg-foreground/15"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
      />

      <div className="flex flex-col gap-12 pt-8 md:flex-row md:justify-between">
        <div className="eyebrow flex flex-col gap-1 opacity-70">
          <p>©{siteConfig.year}</p>
          <p>Designed by {siteConfig.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[auto_auto_auto] md:gap-x-16">
          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <p className="eyebrow opacity-55">{group.title}</p>
              <ul className="label flex flex-col gap-3 font-medium">
                {group.links.map((link) => {
                  const external = /^(mailto:|tel:|https?:)/.test(link.href);
                  return (
                    <li key={link.href}>
                      {external ? (
                        <a
                          href={link.href}
                          className={link.label.includes("@") ? "group normal-case" : "group"}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                        >
                          <RollText>{link.label}</RollText>
                        </a>
                      ) : (
                        <Link href={link.href} className="group">
                          <RollText>{link.label}</RollText>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized faded wordmark, cropped by the bottom edge */}
      <div className="overflow-hidden">
        <motion.p
          aria-hidden="true"
          className="font-display pointer-events-none mt-12 -mb-[0.28em] text-center text-[min(23vw,331px)] leading-[0.8] font-bold tracking-[-0.04em] whitespace-nowrap text-foreground/[0.05] select-none"
          initial={{ y: "30%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          {siteConfig.shortName}
        </motion.p>
      </div>
    </footer>
  );
}
