import Image from "next/image";
import type { Media as MediaType } from "@/types";
import { cn } from "@/lib/utils";

type MediaProps = {
  media: MediaType;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Fills its parent. Shows the photo when `src` is set, otherwise a solid tone.
export function Media({ media, className, sizes = "100vw", priority }: MediaProps) {
  return (
    <div className={cn("absolute inset-0", className)} style={{ backgroundColor: media.tone }}>
      {media.src && (
        <Image
          src={media.src}
          alt={media.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
