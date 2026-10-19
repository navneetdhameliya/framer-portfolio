# Artonest

Portfolio website built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and Motion.
The layout, type scale and interactions follow the reference design; all content is placeholder.

## Commands

```bash
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Environment

`.env` and `.env.local` stay on your computer: git ignores every `.env*` file,
so none of them are pushed.

- `.env.local` – local secrets, e.g. `GMAIL_APP_PASSWORD` for the contact form.
- On Vercel, set `GMAIL_APP_PASSWORD` in Project → Settings → Environment
  Variables. The site address comes from Vercel automatically; set
  `NEXT_PUBLIC_SITE_URL` there only to override it (e.g. a custom domain).

The scripts call `node node_modules/...` directly instead of `next`/`eslint`, because the
parent folder name contains `&`, which breaks npm's Windows `.cmd` shims.

## Pages

- `/` – hero + work grid (each card opens the live site in a new tab)
- `/contact` – "Contact Me" form (name, email, message) that emails inquiries from your Gmail via `/api/contact`

The home page ends with the lime "Let's work together" panel; every page ends with the footer.

## Updating content

All copy lives in `src/data/`:

- `site.ts` – website title, studio name, tagline, email, phone, nav and footer links
- `projects.ts` – client work: title, live URL, industry, service (from the "Framer 2026 Work sheet")

Project covers are screenshots of the live sites in `public/images/work/<slug>.webp`
(900px wide). To add a project, add a row to `projects.ts` and drop a matching
`<slug>.webp` in that folder; to replace a cover, overwrite the file.

The logo is `public/images/logo.png` (rendered by `src/components/ui/Logo.tsx`).

## Contact form

The form posts to `/api/contact` (`src/app/api/contact/route.ts`), which sends the
inquiry from artonest.design@gmail.com to itself as a Name / Email / Message
table, with the visitor as Reply-To. The thank-you pop-up opens as soon as the
visitor clicks Submit; if sending fails it switches to an error and the form is
refilled. No third-party form service or activation is involved.

It needs one secret, a **Gmail App Password** for that account:

1. Turn on 2-Step Verification for the Google account, then create an app
   password at https://myaccount.google.com/apppasswords.
2. Vercel → Project → Settings → Environment Variables: add
   `GMAIL_APP_PASSWORD` with that value, then redeploy.
3. Locally: paste it after `GMAIL_APP_PASSWORD=` in `.env.local` (never in `.env`).

## Structure

```
src/
  app/
    layout.tsx             Fonts (Boska + Switzer via Fontshare), header, footer
    page.tsx               Home (hero, work grid, CTA panel)
    contact/page.tsx       Contact form
    globals.css            Color tokens, breakpoints (810px / 1200px), label styles
  components/
    layout/                Header (slide-in, mobile menu), Footer (line draw, wordmark)
    sections/              Hero, WorkGrid, ProjectCard, CtaSection, ContactForm
    ui/                    Button, RollText, Reveal, SplitHeading, Media, Logo, Arrow
  data/                    site.ts, projects.ts
  lib/                     motion.ts (shared easing), utils.ts
  types/                   Shared types
```

## Motion reference

- Easing everywhere: `cubic-bezier(0.12, 0.23, 0.13, 0.96)`
- Header: slides down from −150px, 1s, 0.4s delay
- Headings: words drop in one by one from a 1px blur (`SplitHeading`)
- Text blocks and cards: fade up 24px on scroll (`Reveal`)
- Work grid (≥810px): while the grid scrolls past, the middle column rises 480px and the outer columns sink 160px
- Hover: labels roll up (`RollText`), button arrows slide through, cards zoom slightly and show an ↗ badge
