import { cn } from "@/lib/utils";

// Hover effect: the label slides up and an identical copy rolls in from below.
// The parent needs the `group` class.
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.12,0.23,0.13,0.96)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.12,0.23,0.13,0.96)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
