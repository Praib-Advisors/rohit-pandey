"use client";

import { useState } from "react";
import Wave from "@/components/Wave";
import { type Locale } from "@/lib/i18n";
import {
  INTERESTED_AREAS,
  validateMemberInput,
  type RegisterMemberInput,
} from "@/lib/khalilabad-army-types";

interface HomeKhalilabadArmySectionProps {
  lang: Locale;
}

export default function HomeKhalilabadArmySection({ lang }: HomeKhalilabadArmySectionProps) {
  const isHi = lang === "hi";
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form fields
  const [formData, setFormData] = useState<RegisterMemberInput>({
    full_name: "",
    mobile: "",
    village_ward_area: "",
    age: "",
    interested_area: "",
    message: "",
  });

  const handleResetForm = () => {
    setFormData({
      full_name: "",
      mobile: "",
      village_ward_area: "",
      age: "",
      interested_area: "",
      message: "",
    });
    setSuccessData(null);
    setErrorMsg(null);
    setFieldErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateMemberInput(formData, isHi ? "hi" : "en");
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/khalilabad-army/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        registrationId?: string;
      };

      if (!res.ok || !data.ok) {
        if (data.error === "duplicate_mobile") {
          setErrorMsg(
            isHi
              ? "यह मोबाइल नंबर पहले से खलीलाबाद आर्मी में पंजीकृत है।"
              : "This mobile number is already registered with Khalilabad Army."
          );
        } else if (data.message) {
          setErrorMsg(data.message);
        } else {
          setErrorMsg(
            isHi
              ? "पंजीकरण में समस्या आई। कृपया पुनः प्रयास करें।"
              : "Registration failed. Please try again."
          );
        }
        setIsLoading(false);
        return;
      }

      if (!data.registrationId) {
        setErrorMsg(
          isHi
            ? "पंजीकरण संख्या प्राप्त नहीं हुई। कृपया पुनः प्रयास करें।"
            : "Registration ID not received. Please try again."
        );
        setIsLoading(false);
        return;
      }

      setSuccessData({
        registrationId: data.registrationId,
        name: formData.full_name,
      });
      setIsLoading(false);
    } catch {
      setErrorMsg(
        isHi
          ? "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
          : "Network error. Please check your connection and try again."
      );
      setIsLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!successData?.registrationId) return;
    navigator.clipboard.writeText(successData.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Wave tone="ivory" />
      <section
        id="khalilabad-army"
        aria-labelledby="home-army-heading"
        className="surface-ivory grain relative overflow-hidden py-20 md:py-28 text-ink"
      >
        {/* Background Rally Crowd Image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            src="/images/rohit-pandey-youth-march.jpg"
            alt=""
            className="size-full object-cover object-bottom opacity-[0.36] md:opacity-[0.40] mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)] anim-slow-zoom will-change-transform"
          />
          {/* Subtle warm ivory gradient overlay preserving contrast and section harmony */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#f5f3ee]/15 to-[#f5f3ee]/55" />
        </div>

        <div className="shell relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14 items-center">
            {/* ============================================================== */}
            {/* LEFT COLUMN: Community Introduction                           */}
            {/* ============================================================== */}
            <div className="min-w-0 lg:col-span-5 flex flex-col text-center lg:text-left">
              {/* Main Heading */}
              <h2
                id="home-army-heading"
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18] anim-rise"
              >
                {isHi ? (
                  <>
                    <span>आइए, </span>
                    <span className="text-[#c51f28]">खलीलाबाद आर्मी</span>
                    <span> से जुड़ें!</span>
                  </>
                ) : (
                  <>
                    <span>Join </span>
                    <span className="text-[#c51f28]">Khalilabad Army!</span>
                  </>
                )}
              </h2>

              {/* Description */}
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal anim-rise-late">
                {isHi
                  ? "खलीलाबाद के बेहतर भविष्य की इस अनूठी पहल का हिस्सा बनें।"
                  : "Be a part of the initiative for a better future for Khalilabad."}
              </p>

              {/* Three Visual Highlights in Horizontal Row */}
              <div className="mt-8 flex items-center justify-between sm:justify-center lg:justify-start gap-2 sm:gap-6 pt-2">
                {/* Highlight 1 */}
                <div className="group cursor-default flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[125px] transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0">
                  <div className="flex size-13 sm:size-14 items-center justify-center rounded-2xl bg-red-50/90 border border-red-200/80 text-[#c51f28] shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:border-red-300/90 group-hover:bg-red-50 group-active:scale-100">
                    <svg className="size-6 sm:size-7 transition-transform duration-300 ease-out group-hover:rotate-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs sm:text-sm font-bold text-slate-800 leading-tight text-center transition-colors duration-200 group-hover:text-red-700">
                    {isHi ? "सशक्त समुदाय" : "Stronger Community"}
                  </span>
                </div>

                {/* Divider 1 */}
                <div className="h-10 w-px bg-slate-300/80 shrink-0 self-center" />

                {/* Highlight 2 */}
                <div className="group cursor-default flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[125px] transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0">
                  <div className="flex size-13 sm:size-14 items-center justify-center rounded-2xl bg-red-50/90 border border-red-200/80 text-[#c51f28] shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:border-red-300/90 group-hover:bg-red-50 group-active:scale-100">
                    <svg className="size-6 sm:size-7 transition-transform duration-300 ease-out group-hover:rotate-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.5 14.5L7 16l-3-3m11.5 1.5L17 16l3-3"
                      />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs sm:text-sm font-bold text-slate-800 leading-tight text-center transition-colors duration-200 group-hover:text-red-700">
                    {isHi ? "सामूहिक प्रयास" : "Collective Action"}
                  </span>
                </div>

                {/* Divider 2 */}
                <div className="h-10 w-px bg-slate-300/80 shrink-0 self-center" />

                {/* Highlight 3 */}
                <div className="group cursor-default flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[125px] transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0">
                  <div className="flex size-13 sm:size-14 items-center justify-center rounded-2xl bg-red-50/90 border border-red-200/80 text-[#c51f28] shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:border-red-300/90 group-hover:bg-red-50 group-active:scale-100">
                    <svg className="size-6 sm:size-7 transition-transform duration-300 ease-out group-hover:rotate-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs sm:text-sm font-bold text-slate-800 leading-tight text-center transition-colors duration-200 group-hover:text-red-700">
                    {isHi ? "बेहतर खलीलाबाद" : "A Better Khalilabad"}
                  </span>
                </div>
              </div>

              {/* Tagline Callout (Artistic Brush Stroke Banner) */}
              <div className="mt-8 sm:mt-10 flex justify-center lg:justify-start">
                <div className="relative inline-flex items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:drop-shadow-[0_12px_24px_rgba(197,31,40,0.45)] cursor-pointer active:translate-y-0">
                  <svg
                    viewBox="0 0 380 56"
                    className="w-[290px] sm:w-[350px] md:w-[380px] h-auto drop-shadow-[0_8px_16px_rgba(197,31,40,0.35)]"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    {/* Orange Underlay Stroke */}
                    <path
                      d="M16 48 C 65 52, 190 56, 365 48 C 374 48, 355 54, 325 55 C 205 57, 75 55, 24 52 Z"
                      fill="#ea580c"
                      opacity="0.9"
                    />
                    {/* Main Red Brush Stroke Body */}
                    <path
                      d="M20 7 C 75 3, 200 2, 360 6 C 375 11, 366 21, 370 33 C 373 45, 358 48, 342 49 C 275 52, 95 53, 26 47 C 12 45, 17 35, 13 25 C 9 15, 14 9, 20 7 Z"
                      fill="url(#brush-red-grad)"
                    />
                    <defs>
                      <linearGradient id="brush-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="50%" stopColor="#c51f28" />
                        <stop offset="100%" stopColor="#991b1b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-heading italic text-white text-sm sm:text-base md:text-lg font-bold tracking-wide drop-shadow-xs px-4">
                    {isHi ? "एक सशक्त कल के लिए एकजुट" : "Together for a Stronger Tomorrow"}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: Membership Registration Form Card                */}
            {/* ============================================================== */}
            <div className="min-w-0 lg:col-span-7 pt-5 sm:pt-6">
              <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] pt-11 sm:pt-12 px-5 sm:px-8 md:px-9 pb-8 anim-rise-late transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]">
                {/* Top Circular Community Badge */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#c51f28] text-white ring-4 ring-white shadow-md z-10 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-default">
                  <svg className="size-7 sm:size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                {/* SUCCESS VIEW */}
                {successData ? (
                  <div className="text-center py-4">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-50 text-green-700 ring-8 ring-green-50/50">
                      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                      {isHi
                        ? "धन्यवाद! आपका रजिस्ट्रेशन प्राप्त हो गया है।"
                        : "Thank you! Registration received successfully."}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600">
                      {isHi
                        ? `${successData.name}, खलीलाबाद आर्मी की इस पहल से जुड़ने के लिए आपका स्वागत है।`
                        : `Welcome ${successData.name}, thank you for joining Khalilabad Army.`}
                    </p>

                    <div className="my-5 inline-flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 px-5 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                        {isHi ? "आपकी पंजीकरण संख्या" : "Your Registration ID"}
                      </span>
                      <div className="mt-1 flex items-center gap-2.5">
                        <span className="font-mono text-lg font-bold tracking-wider text-slate-900 sm:text-xl">
                          {successData.registrationId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          title={isHi ? "आईडी कॉपी करें" : "Copy ID"}
                          className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          {copied ? (
                            <span className="text-green-700 font-semibold">
                              {isHi ? "कॉपी हो गया!" : "Copied!"}
                            </span>
                          ) : (
                            <>
                              <svg className="size-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>{isHi ? "कॉपी" : "Copy"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center justify-center rounded-xl bg-[#c51f28] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 cursor-pointer shadow-sm"
                      >
                        {isHi ? "अन्य सदस्य जोड़ें" : "Register Another"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* REGISTRATION FORM VIEW */
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                        {isHi ? "सदस्यता पंजीकरण फ़ॉर्म" : "Membership Registration Form"}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        {isHi ? "कृपया अपनी जानकारी भरें" : "Please enter your details"}
                      </p>
                    </div>

                    {/* Top Error Alert */}
                    {errorMsg && (
                      <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs sm:text-sm text-red-800">
                        <div className="flex items-start gap-2">
                          <svg className="mt-0.5 size-4 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{errorMsg}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Field 1: Full Name */}
                      <div>
                        <label
                          htmlFor="home_reg_full_name"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          {isHi ? "पूरा नाम" : "Full Name"} <span className="text-red-600">*</span>
                        </label>
                        <div className="relative mt-1.5">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            id="home_reg_full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder={isHi ? "अपना पूरा नाम लिखें" : "Enter your full name"}
                            className={`block w-full rounded-xl border bg-slate-50/80 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                              fieldErrors.full_name
                                ? "border-red-500 focus:border-red-500 bg-red-50/20"
                                : "border-slate-200 focus:border-red-500"
                            }`}
                          />
                        </div>
                        {fieldErrors.full_name && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>
                        )}
                      </div>

                      {/* Field 2 & 3: Mobile Number & Age in 2 Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
                        {/* Mobile Number */}
                        <div className="sm:col-span-8">
                          <label
                            htmlFor="home_reg_mobile"
                            className="block text-xs font-semibold text-slate-800"
                          >
                            {isHi ? "मोबाइल नंबर" : "Mobile Number"}{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <div className="relative mt-1.5">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 left-8 flex items-center pl-1 text-xs font-medium text-slate-500">
                              +91
                            </span>
                            <input
                              type="tel"
                              id="home_reg_mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              maxLength={10}
                              required
                              placeholder="9876543210"
                              className={`block w-full rounded-xl border bg-slate-50/80 pl-16 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                                fieldErrors.mobile
                                  ? "border-red-500 focus:border-red-500 bg-red-50/20"
                                  : "border-slate-200 focus:border-red-500"
                              }`}
                            />
                          </div>
                          {fieldErrors.mobile && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                          )}
                        </div>

                        {/* Age */}
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="home_reg_age"
                            className="block text-xs font-semibold text-slate-800"
                          >
                            {isHi ? "आयु" : "Age"}{" "}
                            <span className="text-[11px] font-normal text-slate-500">
                              ({isHi ? "वैकल्पिक" : "optional"})
                            </span>
                          </label>
                          <div className="relative mt-1.5">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </span>
                            <input
                              type="number"
                              id="home_reg_age"
                              name="age"
                              min="18"
                              max="120"
                              value={formData.age ?? ""}
                              onChange={handleChange}
                              placeholder={isHi ? "उम्र" : "Age"}
                              className={`block w-full rounded-xl border bg-slate-50/80 pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                                fieldErrors.age
                                  ? "border-red-500 focus:border-red-500 bg-red-50/20"
                                  : "border-slate-200 focus:border-red-500"
                              }`}
                            />
                          </div>
                          {fieldErrors.age && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.age}</p>
                          )}
                        </div>
                      </div>

                      {/* Field 4: Village / Ward / Area */}
                      <div>
                        <label
                          htmlFor="home_reg_village_ward_area"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          {isHi ? "गाँव / वार्ड / क्षेत्र" : "Village / Ward / Area"}{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="relative mt-1.5">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            id="home_reg_village_ward_area"
                            name="village_ward_area"
                            value={formData.village_ward_area}
                            onChange={handleChange}
                            required
                            placeholder={
                              isHi
                                ? "उदा. खलीलाबाद शहर, वार्ड नं. 4 / मगहर / सेमरियावां"
                                : "e.g., Ward 4, Khalilabad / Maghar"
                            }
                            className={`block w-full rounded-xl border bg-slate-50/80 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                              fieldErrors.village_ward_area
                                ? "border-red-500 focus:border-red-500 bg-red-50/20"
                                : "border-slate-200 focus:border-red-500"
                            }`}
                          />
                        </div>
                        {fieldErrors.village_ward_area && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.village_ward_area}
                          </p>
                        )}
                      </div>

                      {/* Field 5: Interested Area */}
                      <div>
                        <label
                          htmlFor="home_reg_interested_area"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          {isHi ? "रुचि का क्षेत्र" : "Interested Area"}{" "}
                          <span className="text-[11px] font-normal text-slate-500">
                            ({isHi ? "वैकल्पिक" : "optional"})
                          </span>
                        </label>
                        <div className="relative mt-1.5">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </span>
                          <select
                            id="home_reg_interested_area"
                            name="interested_area"
                            value={formData.interested_area ?? ""}
                            onChange={handleChange}
                            className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 transition-colors focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                          >
                            <option value="">
                              {isHi ? "-- क्षेत्र चुनें --" : "-- Select Area --"}
                            </option>
                            {INTERESTED_AREAS.map((area) => (
                              <option key={area.id} value={area.id}>
                                {isHi ? area.hi : area.en}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message (Optional) */}
                      <div>
                        <label
                          htmlFor="home_reg_message"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          {isHi ? "संदेश" : "Message"}{" "}
                          <span className="text-[11px] font-normal text-slate-500">
                            ({isHi ? "वैकल्पिक" : "optional"})
                          </span>
                        </label>
                        <div className="relative mt-1.5">
                          <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3.5 text-slate-400">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.358.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.502 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                          </span>
                          <textarea
                            id="home_reg_message"
                            name="message"
                            rows={3}
                            value={formData.message ?? ""}
                            onChange={handleChange}
                            placeholder={
                              isHi
                                ? "खलीलाबाद के विकास या अपनी राय के बारे में कोई संदेश लिखें..."
                                : "Write any message or thoughts for Khalilabad..."
                            }
                            className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c51f28] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white py-3.5 px-6 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <svg className="size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span>{isHi ? "पंजीकरण हो रहा है..." : "Submitting..."}</span>
                          </>
                        ) : (
                          <>
                            {/* Send / Paper airplane icon */}
                            <svg className="size-4.5 -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <span>{isHi ? "अभी जुड़ें" : "Join Now"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
