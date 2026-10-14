import { PillContent, pillClass } from "@/components/ui/Button";
import { EmailMenu } from "@/components/ui/EmailMenu";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";

// Lime "work together" panel shown above the footer on every page.
export function CtaSection() {
  return (
    <section className="container-site">
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[10px] bg-accent px-6 py-24 text-center md:min-h-[490px]">
        <Reveal>
          <p className="label">Want to work together?</p>
        </Reveal>
        <SplitHeading
          as="h2"
          trigger="view"
          text="Let's work together"
          className="mt-4 text-[44px] leading-[1.1] tracking-[-2px] md:text-[60px] md:tracking-[-3px]"
        />
        <Reveal delay={0.2} className="mt-8">
          <EmailMenu className={pillClass} align="center">
            <PillContent>Contact me</PillContent>
          </EmailMenu>
        </Reveal>
      </div>
    </section>
  );
}
