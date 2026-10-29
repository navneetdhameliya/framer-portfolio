import type { Project, Service } from "@/types";

// Client work from the "Framer 2026 Work sheet" (Artonest & Sandip Client Work, then
// Nikunj Client Work). Cards link straight to the live site.
// Cards are 4:3. Covers come from designed thumbnails where available (see
// `thumbnails` below), otherwise from website screenshots.
const work: Array<[slug: string, title: string, url: string, industry: string, service?: Service]> = [
  // Artonest & Sandip Client Work
  ["tamayo-creative-media", "Tamayo Creative Media", "https://www.tamayocreativemedia.com/", "Sports Media"],
  ["srg-property-group", "SRG Property Group", "https://srgpropertygroup.com/", "Property & Construction", "Design + Development"],
  ["zyvyo", "Zyvyo", "https://zyvyo.com/", "Healthcare", "Design + Development"],
  ["ecs-groupe", "ECS Groupe", "https://www.ecs-ltd.uk/", "Construction & Infrastructure", "Design + Development"],
  ["glx-digital", "GLX Digital", "https://www.glxdigital.com/", "Energy Technology", "Design + Development"],
  ["victoria-uluwatu", "Victoria Ulwatu", "https://www.victoriauluwatu.com/", "Hospitality", "Design + Development"],
  ["sita-studio", "Sita Studio", "https://sita.studio/", "Creative Agency", "Design + Development"],
  ["kennedy-and-co", "Kennedy & Co.", "https://www.kennedyco.co.uk/", "Construction Consulting", "Development"],
  ["storymakers-london", "Storymakers London", "https://www.storymakers.london/", "Advertising & Creative", "Development"],
  ["hd-visual-story", "HD Visual Story", "https://hdvisualstory.com/", "Content Marketing", "Design + Development"],
  ["excerra", "Excerra", "https://www.excerra.com/", "Business Consulting", "Design + Development"],
  ["oseille-tv", "Oseille TV", "https://oseille.tv/", "E-commerce Education", "Design + Development"],
  ["mucodi", "Mucodi", "https://www.mucodi.co/", "Museum Technology", "Design + Development"],
  ["zorgsense", "Zorgsense", "https://zorgsense.nl/", "Healthcare Consulting", "Design + Development"],
  ["centre-medical-decointe", "Center Medical Decointe", "https://centremedicaldecointe.be/", "Medical Clinic", "Development"],
  ["noca-media", "Noca Media", "https://nocamedia.com/", "Media & Production", "Development"],
  ["autovrse", "Autovrse", "https://www.autovrse.com/", "AR/VR Technology", "Development"],
  ["dr-ketan-patel", "Dr. Ketan Patel", "https://drketanpatelphysio.com/", "Healthcare / Physiotherapy", "Design + Development"],
  // Nikunj Client Work
  ["kehinde-mccomb", "Digital Marketing / Social Media Marketing", "https://www.kehindemccomb.com/", "Digital Marketing", "Design + Development"],
  ["london-travel-clinic", "London Travel Clinic", "https://northlondontravelclinics.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["city-of-london-clinic", "City of London Clinic", "https://www.cityoflondonclinic.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["tanday-pharmacy", "Tanday Pharmacy", "https://salisburyclinic.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["hassen-gate-travel-clinic", "Hassen Gate Travel Clinic", "https://www.essexclinics.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["liverpool-clinic", "Liverpool Clinic", "https://liverpoolclinic.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["northampton-travel-clinic", "Northampton Travel Clinic", "https://northamptonclinics.co.uk/", "Healthcare - Travel Clinic", "Design + Development"],
  ["chimpy", "Chimpy", "https://heychimpy.com/", "Technology / Powerbank Rental", "Design + Development"],
  ["momntum", "Momntum", "https://momntum.com/", "AI / SaaS", "Design + Development"],
];

// Projects with a designed 1600×1200 thumbnail in public/images/thumbnails/<slug>.webp.
// Everything else uses its website screenshot from public/images/work/<slug>.webp.
// (New images get new file names so image caches never serve an old version.)
const thumbnails = new Set([
  "centre-medical-decointe",
  "ecs-groupe",
  "excerra",
  "glx-digital",
  "hd-visual-story",
  "kennedy-and-co",
  "noca-media",
  "oseille-tv",
  "tamayo-creative-media",
  "victoria-uluwatu",
  "zorgsense",
]);

// Second image shown on hover: slug → file name in public/images/thumbnails (without .webp).
const hoverImages: Record<string, string> = {
  zorgsense: "zorgsense-2",
};

export const projects: Project[] = work.map(([slug, title, url, industry, service]) => ({
  slug,
  title,
  url,
  industry,
  service,
  cover: {
    src: thumbnails.has(slug) ? `/images/thumbnails/${slug}.webp` : `/images/work/${slug}.webp`,
    alt: `${title} website`,
    tone: "#e8e6dc",
  },
  hover: hoverImages[slug]
    ? { src: `/images/thumbnails/${hoverImages[slug]}.webp`, alt: `${title} website pages`, tone: "#e8e6dc" }
    : undefined,
}));
