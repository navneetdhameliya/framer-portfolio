import { isEmailFormatValid, suggestEmail } from "@/lib/email-check";
import { domainAcceptsMail } from "@/lib/email-domain";

// Quick check the contact form runs before showing the thank-you pop-up.
// Responds { ok: true } or { ok: false, reason: "format" | "domain", suggestion }.
export async function POST(request: Request) {
  let email = "";
  try {
    email = String((await request.json()).email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ ok: false, reason: "format", suggestion: null }, { status: 400 });
  }

  if (!isEmailFormatValid(email)) {
    return Response.json({ ok: false, reason: "format", suggestion: suggestEmail(email) });
  }
  // Block domains that can't receive mail, and near-misses of well-known
  // providers ("gmial.com", "gmai.com"): those are typos even when someone has
  // set up mail servers on them to catch mistyped email.
  const suggestion = suggestEmail(email);
  if (suggestion || (await domainAcceptsMail(email)) === "no") {
    return Response.json({ ok: false, reason: "domain", suggestion });
  }
  return Response.json({ ok: true });
}
