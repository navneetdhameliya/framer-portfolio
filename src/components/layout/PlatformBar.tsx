import { Arrow } from "@/components/ui/Arrow";
import { RollText } from "@/components/ui/RollText";
import { platformLinks } from "@/data/site";

// Strip under the footer linking to marketplace profiles (Framer, Contra).
export function PlatformBar() {
  return (
    <div className="border-t border-foreground/10">
      <div className="container-site flex py-5 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow opacity-70">Hire me on</p>
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
