import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { hireLinks } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="container-site pt-36 pb-24 md:pt-[160px] md:pb-32">
      <div className="mx-auto flex max-w-[760px] flex-col">
        <div className="flex flex-col items-center text-center">
          <SplitHeading
            text="Contact Me"
            className="text-[56px] leading-[1.1] tracking-[-2px] md:text-[clamp(64px,7vw,96px)] md:tracking-[-0.04em]"
            delay={0.1}
          />
          <Reveal trigger="load" delay={0.4} className="mt-6 max-w-[520px] text-[18px] leading-[26px] md:text-[20px] md:leading-[28px]">
            <p>Have a project in mind? Send a message and I&apos;ll get back to you within one business day.</p>
          </Reveal>
        </div>

        <Reveal trigger="load" delay={0.55} className="mt-12 md:mt-16">
          <ContactForm />
        </Reveal>

        {/* Freelance platforms, as an alternative to the form */}
        <Reveal className="mt-20 rounded-[10px] bg-foreground p-6 text-background md:mt-24 md:p-10">
          <div className="flex items-end justify-between gap-6 border-b border-background/15 pb-4">
            <h2 className="font-display text-[28px] leading-none font-bold tracking-[-1px] md:text-[32px]">Hire me on</h2>
            <p className="eyebrow pb-0.5 opacity-70">Prefer a platform?</p>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {hireLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full min-h-[132px] flex-col justify-between rounded-[10px] border border-background/15 p-5 transition-colors duration-300 hover:border-background hover:bg-background hover:text-foreground"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-display text-[28px] leading-none font-bold tracking-[-1px]">{link.label}</span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-background/25 transition-colors duration-300 group-hover:border-foreground/20">
                      <Arrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    </span>
                  </span>
                  <span className="mt-6 text-[14px] leading-[20px] opacity-65 transition-opacity group-hover:opacity-70">{link.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
