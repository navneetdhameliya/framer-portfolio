import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";

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
      </div>
    </section>
  );
}
