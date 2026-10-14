import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

// Row-aligned grid: 1 column on phones, 2 on tablets, 3 on desktop.
export function WorkGrid() {
  return (
    <section id="work" aria-labelledby="work-heading" className="container-site pb-24 md:pb-32">
      <Reveal>
        <div className="flex items-end justify-between gap-6 border-b border-foreground/15 pb-5">
          <h2 id="work-heading" className="font-display text-[36px] leading-none font-bold tracking-[-1.5px] md:text-[48px] md:tracking-[-2px]">
            Selected work
          </h2>
          <p className="eyebrow pb-1 opacity-60">{projects.length} live projects</p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
