import { Arrow } from "@/components/ui/Arrow";
import { Media } from "@/components/ui/Media";
import type { Project } from "@/types";

// "srgpropertygroup.com" from "https://www.srgpropertygroup.com/"
const displayUrl = (url: string) => new URL(url).hostname.replace(/^www\./, "");

// Portrait card linking to the live site. Caption hierarchy:
// bold title → muted industry label → site address.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-foreground/5">
        <Media
          media={project.cover}
          sizes="(min-width: 1200px) 33vw, (min-width: 810px) 50vw, 100vw"
          className="transition-transform duration-700 ease-[cubic-bezier(0.12,0.23,0.13,0.96)] group-hover:scale-[1.04] [&_img]:object-top"
        />
        <span className="absolute top-4 right-4 flex size-10 scale-75 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Arrow className="size-4 -rotate-45" />
        </span>
      </div>

      <div className="mt-5 flex flex-col">
        <h3 className="text-[18px] leading-[24px] font-semibold tracking-[-0.2px]">{project.title}</h3>
        <p className="eyebrow mt-1.5 opacity-55">{project.industry}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 self-start border-b border-transparent pb-px text-[14px] leading-[18px] opacity-80 transition group-hover:border-foreground group-hover:opacity-100">
          {displayUrl(project.url)}
          <Arrow className="size-3 -rotate-45" />
        </p>
      </div>
    </a>
  );
}
