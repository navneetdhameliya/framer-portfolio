import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { contactHref } from "@/data/site";

// Black "work together" panel shown at the end of the home page.
export function CtaSection() {
  return (
    <section className="container-site">
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[10px] bg-foreground px-6 py-24 text-background text-center md:min-h-[490px]">
        <Reveal>
          <p className="label opacity-70">Want to work together?</p>
        </Reveal>
        <SplitHeading
          as="h2"
          trigger="view"
          text="Let's work together"
          className="mt-4 text-[44px] leading-[1.1] tracking-[-2px] md:text-[60px] md:tracking-[-3px]"
        />
        <Reveal delay={0.2} className="mt-8">
          <Button href={contactHref} variant="light">
            Contact us
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
