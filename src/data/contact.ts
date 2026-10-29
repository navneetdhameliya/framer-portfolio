// Dropdown choices on the contact form. The form shows exactly these, and
// /api/contact only accepts these values. Edit the lists to change the options.

export const projectTypes = [
  "Project Landing Page",
  "Figma to Framer Design",
  "Framer Website Development",
  "Framer Template Customization",
  "Responsive Design Fixes",
  "Website Performance & SEO",
  "Website Redesign",
  "CMS & Blog Setup",
  "Website Animations & Interactions",
  "Other / Custom Project",
] as const;

export const budgetRanges = ["$50–$100", "$100–$500", "$500–$1,000", "$1,000–$2,000"] as const;
