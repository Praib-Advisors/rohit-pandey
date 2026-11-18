"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";

interface AdminLayoutProps {
  children: React.ReactNode;
  lang: Locale;
  activeTab?: "khalilabad-army" | "dashboard";
}

export default function AdminLayout({
  children,
  lang,
  activeTab = "khalilabad-army",
}: AdminLayoutProps) {
  const isHi = lang === "hi";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if session cookie exists
    const hasToken = document.cookie.includes("admin_token=");
    if (hasToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError(
          isHi
            ? "गलत पासवर्ड। कृपया पुनः प्रयास करें।"
            : "Incorrect password. Please try again."
        );
      }
    } catch {
      setLoginError("Login failed. Check connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 p-6">
        <div className="text-sm text-ink-soft">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100 p-4 overflow-y-auto">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-raised">
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-red-dk text-white font-bold text-lg">
              RP
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold text-ink">
              {isHi ? "व्यवस्थापक लॉगिन" : "Admin Panel Login"}
            </h1>
            <p className="mt-1 text-xs text-ink-soft">
              {isHi
                ? "रोहित पाण्डेय वेबसाइट प्रशासनिक पोर्टल"
                : "Rohit Pandey Website Admin Portal"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {loginError}
              </div>
            )}

            <div>
              <label
                htmlFor="admin_pass"
                className="block text-xs font-semibold uppercase tracking-wider text-ink"
              >
                {isHi ? "पासवर्ड (Password)" : "Password"}
              </label>
              <input
                type="password"
                id="admin_pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="mt-1.5 block w-full rounded-md border border-line px-3.5 py-2.5 text-sm text-ink focus:border-red-dk focus:outline-2 focus:outline-red-dk"
              />
              <p className="mt-1 text-[11px] text-ink-soft">
                Default: <code>admin123</code> (configure via ADMIN_PASSWORD)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-md bg-red-dk py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-deep transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? "Logging in..." : isHi ? "लॉगिन करें" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-center">
            <Link
              href={`/${lang}/khalilabad-army`}
              className="text-xs text-ink-soft hover:text-red-dk"
            >
              ← {isHi ? "खलीलाबाद आर्मी पेज पर लौटें" : "Back to Khalilabad Army"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-ink text-white shrink-0 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col md:overflow-y-auto z-10">
        <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-red-dk font-bold text-sm text-white">
              RP
            </div>
            <div>
              <div className="font-semibold text-sm leading-none">Admin Panel</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Rohit Pandey</div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Toggle Menu"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className={`${mobileMenuOpen ? "block" : "hidden md:block"} p-4 space-y-1`}>
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            {isHi ? "मुख्य मेन्यू" : "Main Navigation"}
          </div>

          <Link
            href={`/${lang}/admin/khalilabad-army`}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "khalilabad-army"
                ? "bg-red-dk text-white shadow-xs"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <svg
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{isHi ? "खलीलाबाद आर्मी सदस्य" : "Khalilabad Army Members"}</span>
          </Link>

          <div className="pt-6 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            {isHi ? "वेबसाइट लिंक" : "External Links"}
          </div>

          <Link
            href={`/${lang}/khalilabad-army`}
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg
              className="size-4.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>{isHi ? "खलीलाबाद आर्मी पेज" : "Khalilabad Army Page"}</span>
          </Link>
        </nav>

        <div className="hidden md:block p-4 mt-auto border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>{isHi ? "लॉग आउट" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
