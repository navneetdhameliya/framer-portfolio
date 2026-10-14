import { Arrow } from "@/components/ui/Arrow";
import { RollText } from "@/components/ui/RollText";
import { platformLinks, upworkUrl } from "@/data/site";

// Strip under the footer linking to marketplace profiles (Upwork, Framer, Contra).
export function PlatformBar() {
  return (
    <div className="border-t border-foreground/10">
      <div className="container-site flex py-5 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={upworkUrl}
          target="_blank"
          rel="noreferrer"
          className="eyebrow group inline-flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Hire me on Upwork
          <Arrow className="size-3 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </a>
        <ul className="flex gap-2">
          {platformLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="label group inline-flex h-10 items-center gap-2 rounded-full border border-foreground/20 px-4 font-medium transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <RollText>{link.label}</RollText>
                <Arrow className="size-3.5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
