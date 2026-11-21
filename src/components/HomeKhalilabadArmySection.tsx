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

  const highlights = [
    {
      title: isHi ? "सशक्त समुदाय" : "Stronger Community",
      desc: isHi
        ? "हर गाँव, कस्बे और वार्ड में परस्पर सहयोग और एकता का विस्तार।"
        : "Uniting voices and families across every ward and village.",
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: isHi ? "सामूहिक प्रयास" : "Collective Action",
      desc: isHi
        ? "स्थानीय जन-समस्याओं और बुनियादी विकास के लिए निरंतर साझेदारी।"
        : "Working together to solve local public concerns and civic needs.",
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: isHi ? "बेहतर खलीलाबाद" : "A Better Khalilabad",
      desc: isHi
        ? "शिक्षा, स्वास्थ्य और जनकल्याण के माध्यम से सर्वांगीण प्रगति।"
        : "Creating sustainable progress, education, and opportunities for all.",
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Wave tone="ivory" />
      <section
        id="khalilabad-army"
        aria-labelledby="home-army-heading"
        className="surface-ivory grain py-20 md:py-28 relative overflow-hidden"
      >
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
            {/* Left Column: Community Introduction */}
            <div className="min-w-0 lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-full border border-red-dk/20 bg-red-tint/40 px-3.5 py-1 text-xs font-semibold text-red-dk">
                  <span className="size-1.5 rounded-full bg-red-dk" />
                  <span>{isHi ? "जन सहभागिता अभियान" : "Citizen Initiative"}</span>
                </div>

                {/* Heading */}
                <h2
                  id="home-army-heading"
                  className="font-heading mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ink leading-[1.15]"
                >
                  {isHi ? (
                    <>
                      आइए, <span className="text-red-dk">खलीलाबाद आर्मी</span> से जुड़ें!
                    </>
                  ) : (
                    <>
                      Join <span className="text-red-dk">Khalilabad Army!</span>
                    </>
                  )}
                </h2>

                {/* Description */}
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-soft">
                  {isHi
                    ? "खलीलाबाद के बेहतर भविष्य की इस अनूठी पहल का हिस्सा बनें। अपने क्षेत्र के सामाजिक उत्थान और विकास में अपना योगदान दें।"
                    : "Be a part of the initiative for a better future for Khalilabad."}
                </p>

                {/* 3 Visual Highlights */}
                <div className="mt-8 space-y-3.5">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-xl border border-line/70 bg-white/70 p-3.5 sm:p-4 shadow-2xs backdrop-blur-xs transition-colors hover:bg-white"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-tint/50 text-red-dk ring-1 ring-red-dk/15">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-base font-bold text-ink sm:text-lg leading-tight">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-ink-soft leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline Callout */}
              <div className="mt-8 sm:mt-10 rounded-2xl border-l-4 border-red-dk bg-white/80 p-5 shadow-xs backdrop-blur-xs ring-1 ring-black/[0.04]">
                <p className="font-heading italic text-ink text-lg sm:text-xl font-medium tracking-tight">
                  &ldquo;{isHi ? "एक सशक्त कल के लिए एकजुट" : "Together for a Stronger Tomorrow"}&rdquo;
                </p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-red-dk">
                  {isHi ? "खलीलाबाद संकल्प" : "Khalilabad Mission"}
                </p>
              </div>
            </div>

            {/* Right Column: Membership Registration Form */}
            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_60px_-24px_rgba(110,11,18,0.14)] border border-line/80 ring-1 ring-black/[0.03]">
                {/* SUCCESS VIEW */}
                {successData ? (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-50 text-green-dk ring-8 ring-green-50/50">
                      <svg
                        className="size-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
                      {isHi
                        ? "धन्यवाद! आपका रजिस्ट्रेशन सफलतापूर्वक प्राप्त हो गया है।"
                        : "Thank you! Your registration has been received successfully."}
                    </h3>

                    <p className="mt-3 text-sm text-ink-soft sm:text-base">
                      {isHi
                        ? `${successData.name}, खलीलाबाद के बेहतर भविष्य और सामाजिक उत्थान की इस पहल से जुड़ने के लिए आपका स्वागत है।`
                        : `Welcome ${successData.name}, thank you for joining the initiative for Khalilabad's progress.`}
                    </p>

                    <div className="my-6 inline-flex flex-col items-center justify-center rounded-xl border border-red-dk/20 bg-red-tint/30 px-6 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-dk">
                        {isHi ? "आपकी पंजीकरण संख्या" : "Your Registration ID"}
                      </span>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="font-mono text-xl font-bold tracking-wider text-ink sm:text-2xl">
                          {successData.registrationId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          title={isHi ? "आईडी कॉपी करें" : "Copy ID"}
                          className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-medium text-ink shadow-xs border border-line hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-red-dk cursor-pointer"
                        >
                          {copied ? (
                            <span className="text-green-dk font-semibold">
                              {isHi ? "कॉपी हो गया!" : "Copied!"}
                            </span>
                          ) : (
                            <>
                              <svg
                                className="size-3.5 text-ink-soft"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span>{isHi ? "कॉपी" : "Copy"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-red-dk px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-deep cursor-pointer shadow-sm"
                      >
                        {isHi ? "अन्य सदस्य जोड़ें" : "Register Another"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* REGISTRATION FORM */
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-6 border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                          {isHi ? "सदस्यता पंजीकरण फ़ॉर्म" : "Membership Registration"}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {isHi ? "कृपया अपनी जानकारी भरें" : "Please enter your details"}
                        </p>
                      </div>
                      <span className="rounded-full bg-red-tint/60 px-3 py-1 text-xs font-semibold text-red-dk">
                        {isHi ? "खलीलाबाद आर्मी" : "Khalilabad Army"}
                      </span>
                    </div>

                    {errorMsg && (
                      <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                        <div className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 size-4 shrink-0 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
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

                    <div className="space-y-4 sm:space-y-4.5">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="home_army_full_name"
                          className="block text-xs font-semibold text-ink sm:text-sm"
                        >
                          {isHi ? "पूरा नाम" : "Full Name"}{" "}
                          <span className="text-red-dk">*</span>
                        </label>
                        <input
                          type="text"
                          id="home_army_full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          placeholder={isHi ? "अपना पूरा नाम लिखें" : "Enter your full name"}
                          className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-muted transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 ${
                            fieldErrors.full_name
                              ? "border-red-500 focus:outline-red-500 bg-red-50/30"
                              : "border-line bg-gray-50/50 focus:outline-red-dk"
                          }`}
                        />
                        {fieldErrors.full_name && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>
                        )}
                      </div>

                      {/* Mobile Number & Age */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-4">
                        {/* Mobile */}
                        <div className="sm:col-span-8">
                          <label
                            htmlFor="home_army_mobile"
                            className="block text-xs font-semibold text-ink sm:text-sm"
                          >
                            {isHi ? "मोबाइल नंबर" : "Mobile Number"}{" "}
                            <span className="text-red-dk">*</span>
                          </label>
                          <div className="relative mt-1.5">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-medium text-ink-soft">
                              +91
                            </span>
                            <input
                              type="tel"
                              id="home_army_mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              maxLength={10}
                              required
                              placeholder="9876543210"
                              className={`block w-full rounded-md border pl-12 pr-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-muted transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 ${
                                fieldErrors.mobile
                                  ? "border-red-500 focus:outline-red-500 bg-red-50/30"
                                  : "border-line bg-gray-50/50 focus:outline-red-dk"
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
                            htmlFor="home_army_age"
                            className="block text-xs font-semibold text-ink sm:text-sm"
                          >
                            {isHi ? "आयु" : "Age"}{" "}
                            <span className="text-xs font-normal text-ink-soft">
                              ({isHi ? "वैकल्पिक" : "optional"})
                            </span>
                          </label>
                          <input
                            type="number"
                            id="home_army_age"
                            name="age"
                            min="18"
                            max="120"
                            value={formData.age ?? ""}
                            onChange={handleChange}
                            placeholder={isHi ? "उम्र" : "Age"}
                            className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-muted transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 ${
                              fieldErrors.age
                                ? "border-red-500 focus:outline-red-500 bg-red-50/30"
                                : "border-line bg-gray-50/50 focus:outline-red-dk"
                            }`}
                          />
                          {fieldErrors.age && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.age}</p>
                          )}
                        </div>
                      </div>

                      {/* Village / Ward / Area */}
                      <div>
                        <label
                          htmlFor="home_army_village_ward_area"
                          className="block text-xs font-semibold text-ink sm:text-sm"
                        >
                          {isHi ? "गाँव / वार्ड / क्षेत्र" : "Village / Ward / Area"}{" "}
                          <span className="text-red-dk">*</span>
                        </label>
                        <input
                          type="text"
                          id="home_army_village_ward_area"
                          name="village_ward_area"
                          value={formData.village_ward_area}
                          onChange={handleChange}
                          required
                          placeholder={
                            isHi
                              ? "उदा. खलीलाबाद शहर, वार्ड नं. 4 / मगहर / सेमरियावां"
                              : "e.g., Ward 4, Khalilabad / Maghar"
                          }
                          className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-muted transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 ${
                            fieldErrors.village_ward_area
                              ? "border-red-500 focus:outline-red-500 bg-red-50/30"
                              : "border-line bg-gray-50/50 focus:outline-red-dk"
                          }`}
                        />
                        {fieldErrors.village_ward_area && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.village_ward_area}
                          </p>
                        )}
                      </div>

                      {/* Interested Area */}
                      <div>
                        <label
                          htmlFor="home_army_interested_area"
                          className="block text-xs font-semibold text-ink sm:text-sm"
                        >
                          {isHi ? "रुचि का क्षेत्र" : "Interested Area"}{" "}
                          <span className="text-xs font-normal text-ink-soft">
                            ({isHi ? "वैकल्पिक" : "optional"})
                          </span>
                        </label>
                        <select
                          id="home_army_interested_area"
                          name="interested_area"
                          value={formData.interested_area ?? ""}
                          onChange={handleChange}
                          className="mt-1.5 block w-full rounded-md border border-line bg-gray-50/50 px-3.5 py-2.5 text-base sm:text-sm text-ink transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 focus:outline-red-dk"
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

                    {/* Submit Button */}
                    <div className="mt-7 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-dk px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-deep disabled:opacity-60 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="size-4 animate-spin text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            <span>{isHi ? "पंजीकरण हो रहा है..." : "Submitting..."}</span>
                          </>
                        ) : (
                          <span>{isHi ? "खलीलाबाद आर्मी से जुड़ें" : "Join Khalilabad Army"}</span>
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
