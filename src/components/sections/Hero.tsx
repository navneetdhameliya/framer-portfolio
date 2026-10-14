import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section className="container-site flex flex-col items-center pt-36 pb-24 text-center md:pt-[120px] md:pb-[120px]">
      <SplitHeading
        text={siteConfig.name}
        className="text-[56px] leading-[1.1] tracking-[-2px] md:text-[clamp(64px,8.7vw,120px)] md:tracking-[-0.04em]"
        delay={0.1}
      />
      <Reveal trigger="load" delay={0.4} className="mt-6 max-w-[600px] text-[20px] leading-[28px]">
        <p>{siteConfig.tagline}</p>
      </Reveal>
      <Reveal trigger="load" delay={0.55} className="mt-8">
        <Button href="/about">About and resume</Button>
      </Reveal>
    </section>
  );
}
