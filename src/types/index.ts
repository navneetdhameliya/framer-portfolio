export type NavItem = {
  label: string;
  href: string;
};

// When `src` is missing, `tone` fills the image slot.
export type Media = {
  src?: string;
  alt?: string;
  tone: string;
};

export type Service = "Design" | "Development" | "Design + Development";

export type Project = {
  slug: string;
  title: string;
  industry: string;
  service?: Service;
  url: string;
  cover: Media;
};
