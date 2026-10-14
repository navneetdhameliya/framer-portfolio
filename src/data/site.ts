import type { NavItem } from "@/types";

// Site-wide content.
export const siteConfig = {
  // Website title: browser tab, search results and the home page heading.
  title: "Artonest Framer Portfolio",
  name: "Artonest Design Studio",
  shortName: "Artonest",
  tagline: "Framer Designer & Developer building digital experiences for SaaS, startups & modern brands.",
  description: "Artonest Design Studio — Framer design and development for SaaS, startups and modern brands.",
  // Public address of the site, used for full URLs in page metadata. Set in .env.local / on the host.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "artonest.design@gmail.com",
  phone: "079841 79697",
  year: new Date().getFullYear(),
};

// Subject used for new emails and contact-form messages.
export const emailSubject = `Project inquiry — ${siteConfig.name}`;
// Opens a new Gmail message to the studio (used by every email link; opens in a new tab).
export const emailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}&su=${encodeURIComponent(emailSubject)}`;

// Page every "Contact us" button leads to.
export const contactHref = "/contact";

// Agency profile linked from "Hire me on Upwork" under the footer.
export const upworkUrl = "https://www.upwork.com/agencies/artonest/";

// Header links. "Contact us" sits separately on the right (see Header.tsx).
export const mainNav: NavItem[] = [{ label: "Home", href: "/" }];

export const footerLinks: { title: string; links: NavItem[] }[] = [
  {
    title: "Website",
    links: [
      { label: "Home", href: "/" },
      { label: "Contact", href: "/contact" },
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
      { label: siteConfig.email, href: emailComposeHref },
      { label: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
    ],
  },
];

// Platform profiles shown in the bar below the footer.
// Freelance platforms shown as cards on the contact page.
export const hireLinks: Array<NavItem & { note: string }> = [
  { label: "Upwork", href: upworkUrl, note: "Agency profile" },
  { label: "Framer", href: "https://www.framer.com/@artonest-design-studio/", note: "Framer expert profile" },
  { label: "Contra", href: "https://contra.com/artonestdesign/work?r=Artonestdesign", note: "Freelance profile" },
];

export const platformLinks: NavItem[] = [
  { label: "Framer", href: "https://www.framer.com/@artonest-design-studio/" },
  { label: "Contra", href: "https://contra.com/artonestdesign/work?r=Artonestdesign" },
];
