export function Arrow({ className, direction = "right" }: { className?: string; direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
