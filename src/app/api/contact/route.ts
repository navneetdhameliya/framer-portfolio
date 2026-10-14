import nodemailer from "nodemailer";
import { emailSubject, siteConfig } from "@/data/site";

// Sends contact-form inquiries from the studio Gmail account to itself, with the
// visitor as Reply-To. Needs GMAIL_APP_PASSWORD (a Gmail App Password) set as a
// secret environment variable: in .env.local locally and in Vercel's settings.

const MAX = { name: 120, email: 200, message: 5000 };

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

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.email) {
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
    ["Message", message],
  ];
  const html = `
    <table cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#1c1e1e;max-width:640px">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <th align="left" valign="top" style="border:1px solid #e3e1d6;background:#f6f5ec;width:110px">${label}</th>
          <td style="border:1px solid #e3e1d6;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>`;

  try {
    await transporter.sendMail({
      from: { name: `${siteConfig.shortName} website`, address: user },
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
