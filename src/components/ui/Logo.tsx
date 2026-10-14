import Image from "next/image";
import { cn } from "@/lib/utils";

// Artonest "a" mark. Size it with width/height classes, e.g. "size-7".
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("relative block", className)}>
      <Image src="/images/logo.png" alt="Artonest" fill sizes="56px" className="object-contain" priority />
    </span>
  );
}
