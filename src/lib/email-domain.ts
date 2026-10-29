import { resolve4, resolveMx } from "node:dns/promises";

// Server only. Checks whether an email address's domain can receive mail at all.
// This catches typos like "gmail.con" or made-up domains; it can't confirm that a
// particular inbox exists (mail servers don't reveal that).
//   "yes"     – the domain has mail servers (or an address mail can go to)
//   "no"      – the domain doesn't exist or explicitly accepts no mail
//   "unknown" – no clear answer (DNS broken or unreachable); callers decide
export type DomainMail = "yes" | "no" | "unknown";

const domainOf = (email: string) => email.slice(email.lastIndexOf("@") + 1).toLowerCase();

// 1. The server's own DNS resolver.
async function viaSystemDns(domain: string): Promise<DomainMail> {
  try {
    const mx = await resolveMx(domain);
    return mx.some((r) => r.exchange && r.exchange !== ".") ? "yes" : "no";
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND") return "no";
    if (code !== "ENODATA") return "unknown"; // resolver unreachable, timeout, server failure…
    // No MX records: mail can still go to the domain's own address record.
    try {
      return (await resolve4(domain)).length > 0 ? "yes" : "no";
    } catch {
      return "no";
    }
  }
}

// 2. Fallback: Cloudflare DNS over HTTPS, for when the system resolver can't be reached.
async function dohQuery(domain: string, type: "MX" | "A") {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(3000),
  });
  return (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] };
}

async function viaDnsOverHttps(domain: string): Promise<DomainMail> {
  try {
    const mx = await dohQuery(domain, "MX");
    if (mx.Status === 3) return "no"; // NXDOMAIN: the domain doesn't exist
    if (mx.Status !== 0) return "unknown"; // e.g. SERVFAIL: the domain's DNS is broken
    const records = (mx.Answer ?? []).filter((a) => a.type === 15).map((a) => a.data.trim());
    if (records.length) return records.some((r) => !/^\d+\s+\.$/.test(r)) ? "yes" : "no";
    const a = await dohQuery(domain, "A");
    return a.Status === 0 && (a.Answer ?? []).some((r) => r.type === 1) ? "yes" : "no";
  } catch {
    return "unknown";
  }
}

export async function domainAcceptsMail(email: string): Promise<DomainMail> {
  const domain = domainOf(email);
  const system = await viaSystemDns(domain);
  return system === "unknown" ? viaDnsOverHttps(domain) : system;
}
