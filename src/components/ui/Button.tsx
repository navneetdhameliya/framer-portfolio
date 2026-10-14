import Link from "next/link";
import { cn } from "@/lib/utils";
import { Arrow } from "./Arrow";
import { RollText } from "./RollText";

type ButtonProps = {
  href: string;
  children: string;
  direction?: "left" | "right";
  className?: string;
};

const slide = "transition-transform duration-500 ease-[cubic-bezier(0.12,0.23,0.13,0.96)]";

// Shared look so a <button> (e.g. the email menu trigger) can match the link pill.
export const pillClass =
  "label group inline-flex h-[47px] items-center gap-2 rounded-full bg-foreground px-5 text-background";

// Label + arrow. On hover the label rolls and the arrow slides out
// while a second arrow slides in behind it.
export function PillContent({ children, direction = "right" }: { children: string; direction?: "left" | "right" }) {
  const arrow = (
    <span className="relative flex size-4 overflow-hidden">
      <Arrow direction={direction} className={cn("absolute inset-0 size-4", slide, direction === "right" ? "group-hover:translate-x-full" : "group-hover:-translate-x-full")} />
      <Arrow direction={direction} className={cn("absolute inset-0 size-4", slide, direction === "right" ? "-translate-x-full" : "translate-x-full", "group-hover:translate-x-0")} />
    </span>
  );
  return (
    <>
      {direction === "left" && arrow}
      <RollText>{children}</RollText>
      {direction === "right" && arrow}
    </>
  );
}

// Dark pill link.
export function Button({ href, children, direction = "right", className }: ButtonProps) {
  const isExternal = /^(mailto:|tel:|https?:)/.test(href);
  const Component = isExternal ? "a" : Link;
  return (
    <Component href={href} className={cn(pillClass, className)}>
      <PillContent direction={direction}>{children}</PillContent>
    </Component>
  );
}
