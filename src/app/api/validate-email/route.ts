import { isEmailFormatValid, suggestEmail } from "@/lib/email-check";
import { domainAcceptsMail } from "@/lib/email-domain";

// Quick check the contact form runs before showing the thank-you pop-up.
// Responds { ok: true } or { ok: false, reason: "format" | "domain", suggestion }.
export async function POST(request: Request) {
  let email = "";
  try {
    email = String((await request.json()).email ?? "").trim();
  } catch {
    return Response.json({ ok: false, reason: "format", suggestion: null }, { status: 400 });
  }

  if (!isEmailFormatValid(email)) {
    return Response.json({ ok: false, reason: "format", suggestion: suggestEmail(email) });
  }
  // Block domains that can't receive mail. When DNS gives no clear answer, block
  // only if the domain also looks like a typo of a common provider ("gmial.com").
  const mail = await domainAcceptsMail(email);
  const suggestion = suggestEmail(email);
  if (mail === "no" || (mail === "unknown" && suggestion)) {
    return Response.json({ ok: false, reason: "domain", suggestion });
  }
  return Response.json({ ok: true });
}
