import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Testimonials } from "@/components/sections/Testimonials";
import { about, testimonials } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-site pb-32">
      <section className="flex flex-col items-center pt-36 pb-24 text-center md:pt-[160px] md:pb-[120px]">
        <SplitHeading
          text={siteConfig.role}
          className="text-[48px] leading-[1.1] tracking-[-2px] md:text-[clamp(60px,7vw,96px)] md:tracking-[-0.04em]"
          delay={0.1}
        />
      </section>

      <div className="mx-auto max-w-[880px]">
        <Reveal className="max-w-[640px]">
          <p className="text-[20px] leading-[28px]">{about.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-6">
          {[
            ["Services", about.services],
            ["Clients", about.clients],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.1}>
              <h2 className="text-[20px] leading-[28px]">{title}</h2>
              <p className="mt-4 max-w-[340px] text-[16px] leading-[22px] opacity-70">{body}</p>
            </Reveal>
          ))}
        </div>

        <hr className="mt-24 border-foreground/15" />

        <section className="pt-16">
          <SplitHeading
            as="h2"
            trigger="view"
            text="What clients say"
            className="mb-12 text-[40px] leading-[1.1] tracking-[-1.5px] md:text-[48px] md:tracking-[-2px]"
          />
          <Reveal>
            <Testimonials items={testimonials} />
          </Reveal>
        </section>
      </div>
    </div>
  );
}
