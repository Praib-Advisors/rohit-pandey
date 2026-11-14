import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { hasLocale } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang";
import "./portal.css";

/**
 * Ideals, e-Shikayat, e-Card and the team dashboard. Their text is written in Hindi with an English
 * entry per string, and the language comes from the address (/hi/... or /en/...).
 */
export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <LangProvider lang={lang}>
      <div className="portal">{children}</div>
    </LangProvider>
  );
}
