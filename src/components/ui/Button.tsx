import Link from "next/link";
import { cn } from "@/lib/utils";
import { Arrow } from "./Arrow";
import { RollText } from "./RollText";

type ButtonProps = {
  href: string;
  children: string;
  direction?: "left" | "right";
  // "light" is for dark backgrounds (e.g. the black CTA panel).
  variant?: "dark" | "light";
  className?: string;
};

const slide = "transition-transform duration-500 ease-[cubic-bezier(0.12,0.23,0.13,0.96)]";

// Shared look so a <button> (e.g. the form submit) can match the link pill.
const pillBase = "label group inline-flex h-[47px] items-center gap-2 rounded-full px-5";
export const pillClass = `${pillBase} bg-foreground text-background`;
const pillLightClass = `${pillBase} bg-background text-foreground`;

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

// Pill link: dark by default, light on dark backgrounds.
export function Button({ href, children, direction = "right", variant = "dark", className }: ButtonProps) {
  const isExternal = /^(mailto:|tel:|https?:)/.test(href);
  const Component = isExternal ? "a" : Link;
  return (
    <Component
      href={href}
      className={cn(variant === "light" ? pillLightClass : pillClass, className)}
    >
      <PillContent direction={direction}>{children}</PillContent>
    </Component>
  );
}
