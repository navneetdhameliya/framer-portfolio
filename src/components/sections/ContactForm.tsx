"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PillContent, pillClass } from "@/components/ui/Button";
import { budgetRanges, projectTypes } from "@/data/contact";
import { emailComposeHref, siteConfig } from "@/data/site";
import { isEmailFormatValid, suggestEmail } from "@/lib/email-check";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Before sending, the visitor's email is checked: format in the browser, then
// /api/validate-email confirms the domain can receive mail. A bad address opens
// an error pop-up (with a "Did you mean…?" fix when there's an obvious typo) and
// nothing is sent. A good one opens the thank-you pop-up right away while
// /api/contact emails the inquiry in the background (failures are logged on the
// server, in Vercel → Logs).

type Popup =
  | { kind: "thanks" }
  | { kind: "bad-email"; reason: "format" | "domain"; suggestion: string | null };

const fieldClass =
  "w-full rounded-[10px] border border-foreground/15 bg-white/50 px-4 text-[16px] leading-[24px] text-foreground placeholder:text-foreground/35 transition-colors outline-none hover:border-foreground/30 focus:border-foreground focus:bg-white";

// Dropdown in the form's field style. Shows the placeholder in muted text until
// a choice is made (":invalid" while the required value is still empty).
function SelectField({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow opacity-60">{label}</span>
      <span className="relative">
        <select
          name={name}
          required
          defaultValue=""
          className={cn(fieldClass, "h-[52px] cursor-pointer appearance-none pr-11 invalid:text-foreground/35 [&>option]:text-foreground")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 opacity-60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}

async function checkEmailOnServer(email: string): Promise<Popup | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("/api/validate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = await res.json();
    if (json.ok) return null;
    return { kind: "bad-email", reason: json.reason === "domain" ? "domain" : "format", suggestion: json.suggestion ?? null };
  } catch {
    return null; // Check unavailable: don't block the visitor.
  }
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [checking, setChecking] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checking) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    // 1. Incomplete or malformed address: answer instantly.
    if (!isEmailFormatValid(email)) {
      setPopup({ kind: "bad-email", reason: "format", suggestion: suggestEmail(email) });
      return;
    }

    // 2. Ask the server whether the email's domain can receive mail.
    setChecking(true);
    const problem = await checkEmailOnServer(email);
    setChecking(false);
    if (problem) {
      setPopup(problem);
      return;
    }

    // 3. Looks good: thank the visitor and send in the background.
    const payload = {
      name: data.get("name"),
      email,
      projectType: data.get("projectType"),
      budget: data.get("budget"),
      message: data.get("message"),
      _honey: data.get("_honey"),
    };
    setPopup({ kind: "thanks" });
    form.reset();
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // finish sending even if the visitor leaves the page
    }).catch(() => {
      // Network failure: nothing to show the visitor; the server logs failures.
    });
  }

  const emailField = () => formRef.current?.elements.namedItem("email") as HTMLInputElement | null;

  const closePopup = useCallback(() => {
    setPopup((current) => {
      // After a bad email, put the cursor back in the email field.
      if (current?.kind === "bad-email") setTimeout(() => emailField()?.select(), 0);
      return null;
    });
  }, []);

  const applySuggestion = (suggestion: string) => {
    const field = emailField();
    if (field) field.value = suggestion;
    setPopup(null);
    setTimeout(() => formRef.current?.querySelector<HTMLButtonElement>("button[type=submit]")?.focus(), 0);
  };

  return (
    <>
      {/* noValidate: the email is checked by our own pop-up instead of the browser's tooltip */}
      <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="eyebrow opacity-60">Name</span>
            <input name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your name" className={cn(fieldClass, "h-[52px]")} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow opacity-60">Email</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@company.com"
              className={cn(fieldClass, "h-[52px]")}
            />
          </label>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <SelectField name="projectType" label="Project type" placeholder="Select a project type" options={projectTypes} />
          <SelectField name="budget" label="Budget range" placeholder="Select a budget" options={budgetRanges} />
        </div>
        <label className="flex flex-col gap-2">
          <span className="eyebrow opacity-60">Message</span>
          <textarea
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder="Tell me about your project"
            className={cn(fieldClass, "resize-y py-3.5")}
          />
        </label>

        {/* Honeypot spam trap, hidden from people and screen readers */}
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-[20px] opacity-60">
            Or email{" "}
            <a href={emailComposeHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {siteConfig.email}
            </a>
          </p>
          <button
            type="submit"
            disabled={checking}
            className={cn(pillClass, "disabled:opacity-70")}
            onClick={(e) => {
              // Empty name/message: let the browser point at the missing field.
              const form = e.currentTarget.form;
              const empty = form && [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[required]")].find((f) => !f.value.trim());
              if (empty && empty.name !== "email") {
                e.preventDefault();
                empty.reportValidity();
              } else if (empty) {
                e.preventDefault();
                setPopup({ kind: "bad-email", reason: "format", suggestion: null });
              }
            }}
          >
            <PillContent>{checking ? "Checking…" : "Submit"}</PillContent>
          </button>
        </div>
      </form>

      <ResultDialog popup={popup} onClose={closePopup} onUseSuggestion={applySuggestion} />
    </>
  );
}

// Centered pop-up for both outcomes. Closes on its button, a click on the
// backdrop, or Escape.
function ResultDialog({
  popup,
  onClose,
  onUseSuggestion,
}: {
  popup: Popup | null;
  onClose: () => void;
  onUseSuggestion: (suggestion: string) => void;
}) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const open = popup !== null;

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const bad = popup?.kind === "bad-email" ? popup : null;

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            key={popup.kind}
            role={bad ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby="result-title"
            aria-describedby="result-text"
            className="w-full max-w-[480px] rounded-[10px] bg-background px-6 py-12 text-center shadow-[0_24px_64px_-24px_rgba(28,30,30,0.45)] md:px-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            {bad ? (
              <>
                <p className="label">Check your email</p>
                <h2 id="result-title" className="font-display mt-4 text-[36px] leading-[1.05] font-bold tracking-[-1.5px] md:text-[44px]">
                  {bad.reason === "domain" ? "This email doesn't exist" : "This email isn't complete"}
                </h2>
                <p id="result-text" className="mx-auto mt-4 max-w-[360px] text-[16px] leading-[24px]">
                  {bad.reason === "domain"
                    ? "We couldn't find that email address. Please check it and try again."
                    : "Please enter your full email address, like name@company.com."}
                </p>
                {bad.suggestion && (
                  <p className="mt-4 text-[16px] leading-[24px]">
                    Did you mean <strong className="font-semibold break-all">{bad.suggestion}</strong>?
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {bad.suggestion ? (
                    <>
                      <button ref={primaryRef} type="button" onClick={() => onUseSuggestion(bad.suggestion!)} className={pillClass}>
                        <PillContent>Use this email</PillContent>
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="label h-[47px] rounded-full border border-foreground/20 px-5 font-medium transition-colors hover:border-foreground"
                      >
                        Try again
                      </button>
                    </>
                  ) : (
                    <button ref={primaryRef} type="button" onClick={onClose} className={pillClass}>
                      <PillContent>Try again</PillContent>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="label">Message sent</p>
                <h2 id="result-title" className="font-display mt-4 text-[40px] leading-[1.05] font-bold tracking-[-1.5px] md:text-[48px]">
                  Thank you!
                </h2>
                <p id="result-text" className="mx-auto mt-4 max-w-[340px] text-[16px] leading-[24px]">
                  Your email has been sent successfully. Thank you for reaching out.
                </p>
                <button ref={primaryRef} type="button" onClick={onClose} className={cn(pillClass, "mt-8")}>
                  <PillContent>Close</PillContent>
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
