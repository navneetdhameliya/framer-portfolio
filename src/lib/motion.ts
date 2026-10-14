// Easing and timings measured from the reference design.
export const ease = [0.12, 0.23, 0.13, 0.96] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
