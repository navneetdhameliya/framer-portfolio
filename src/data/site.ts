import type { NavItem } from "@/types";

// Site-wide content.
export const siteConfig = {
  name: "Artonest Design Studio",
  shortName: "Artonest",
  role: "Designer &\nCreative Director",
  tagline: "Framer Designer & Developer building digital experiences for SaaS, startups & modern brands.",
  description: "Artonest Design Studio — Framer design and development for SaaS, startups and modern brands.",
  // Public address of the site, used for full URLs in page metadata. Set in .env.local / on the host.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "artonest.design@gmail.com",
  phone: "079841 79697",
  year: new Date().getFullYear(),
};

// Subject pre-filled in new email drafts (see components/ui/EmailMenu.tsx).
export const emailSubject = `Project inquiry — ${siteConfig.name}`;
export const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(emailSubject)}`;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export const footerLinks: { title: string; links: NavItem[] }[] = [
  {
    title: "Website",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/artonest.design/" },
      { label: "Behance", href: "https://www.behance.net/artonest" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/artonestdesignstudio.com/" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: siteConfig.email, href: mailtoHref },
      { label: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
    ],
  },
];

// Platform profiles shown in the bar below the footer.
export const platformLinks: NavItem[] = [
  { label: "Framer", href: "https://www.framer.com/@artonest-design-studio/" },
  { label: "Contra", href: "https://contra.com/artonestdesign/work?r=Artonestdesign" },
];
