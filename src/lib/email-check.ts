// Email checks shared by the contact form (browser) and the API routes (server).

// name@domain.tld: no spaces, no empty parts, a top-level domain of 2+ letters.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

export function isEmailFormatValid(email: string) {
  return email.length <= 200 && EMAIL_FORMAT.test(email) && !email.includes("..");
}

// Popular mail domains used to suggest fixes for typos like "gmial.com".
const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "yahoo.co.in",
  "rediffmail.com",
  // Real providers, listed so they're never "corrected" to a similar name.
  "mail.com",
  "email.com",
  "googlemail.com",
  "yahoo.co.uk",
  "hotmail.co.uk",
  "live.co.uk",
  "outlook.in",
  "yahoo.in",
  "gmail.de",
  "gmx.com",
  "gmx.net",
  "ymail.com",
  "yandex.com",
  "zoho.com",
  "msn.com",
  "me.com",
  "mac.com",
];

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

// "nikunj@gmial.com" → "nikunj@gmail.com". Returns null when there's no close match.
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  // Missing ".com" etc.: "gmail" → "gmail.com"
  const bare = COMMON_DOMAINS.find((d) => d.split(".")[0] === domain);
  if (bare) return `${local}@${bare}`;

  let best: string | null = null;
  let bestDistance = 3; // only suggest for 1–2 character mistakes
  for (const d of COMMON_DOMAINS) {
    const dist = editDistance(domain, d);
    if (dist < bestDistance) {
      best = d;
      bestDistance = dist;
    }
  }
  return best ? `${local}@${best}` : null;
}
