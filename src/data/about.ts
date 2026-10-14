import type { Testimonial } from "@/types";

// About page placeholders.
export const about = {
  intro:
    "Hi, I'm Your Name, a designer and creative director based in Your City. One or two sentences about what you do and who you do it for.",
  services: "Service One, Service Two, Service Three, Service Four, Service Five, Service Six",
  clients: "Client One, Client Two, Client Three, Client Four, Client Five, Client Six, Client Seven",
};

export const testimonials: Testimonial[] = [1, 2, 3, 4].map((n, i) => ({
  quote: `Placeholder testimonial ${n}. A client describes what it was like to work together and what the project achieved.`,
  name: `Client Name ${n}`,
  role: "Role, Company",
  image: { tone: ["#d8d4cc", "#c9705e", "#4f7fa6", "#3b3f33"][i] },
}));
