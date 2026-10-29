import nodemailer from "nodemailer";
import { budgetRanges, projectTypes } from "@/data/contact";
import { emailSubject, siteConfig } from "@/data/site";
import { isEmailFormatValid } from "@/lib/email-check";
import { domainAcceptsMail } from "@/lib/email-domain";

// Sends contact-form inquiries to the studio inbox (siteConfig.email), with the
// visitor as Reply-To and "<Visitor> via Artonest website" as the sender name.
// Sending account: GMAIL_USER (defaults to the studio inbox) + GMAIL_APP_PASSWORD,
// both set in .env.local locally and in Vercel's settings. Gmail shows "me" for
// mail from your own address, so use a separate sending account (e.g. a second
// Gmail) for the visitor's name to appear in the inbox list.

const MAX = { name: 120, message: 5000 };

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success so they move on.
  if (typeof body._honey === "string" && body._honey.trim()) {
    return Response.json({ ok: true });
  }

  // Newlines are stripped so the name is safe to use in the sender header.
  const name = String(body.name ?? "").replace(/[\r\n]+/g, " ").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const projectType = String(body.projectType ?? "");
  const budget = String(body.budget ?? "");

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: "Please fill in your name, email and message." }, { status: 400 });
  }
  // Only the dropdowns' own choices are accepted.
  if (!(projectTypes as readonly string[]).includes(projectType) || !(budgetRanges as readonly string[]).includes(budget)) {
    return Response.json({ ok: false, error: "Please choose a project type and budget range." }, { status: 400 });
  }
  // Only a definite "no" blocks here, so a DNS hiccup never drops a real inquiry.
  if (!isEmailFormatValid(email) || (await domainAcceptsMail(email)) === "no") {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > MAX.name || message.length > MAX.message) {
    return Response.json({ ok: false, error: "Your message is too long." }, { status: 400 });
  }

  const user = process.env.GMAIL_USER || siteConfig.email;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!pass) {
    console.error("Contact form: GMAIL_APP_PASSWORD is not set.");
    return Response.json({ ok: false, error: "Email sending isn't set up yet." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Project type", projectType],
    ["Budget", budget],
    ["Message", message],
  ];
  const html = `
    <table cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#1c1e1e;max-width:640px">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <th align="left" valign="top" style="border:1px solid #e3e1d6;background:#f6f5ec;width:120px">${label}</th>
          <td style="border:1px solid #e3e1d6;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>`;

  try {
    await transporter.sendMail({
      from: { name: `${name} via ${siteConfig.shortName} website`, address: user },
      to: siteConfig.email,
      replyTo: { name, address: email },
      subject: `${emailSubject} from ${name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
      html,
    });
  } catch (err) {
    console.error("Contact form: sending failed.", err);
    return Response.json({ ok: false, error: "Sorry, your message couldn't be sent." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
