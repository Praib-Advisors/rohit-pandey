"use client";

import { useState, useRef } from "react";
import Wave from "@/components/Wave";
import { type Locale } from "@/lib/i18n";
import {
  INTERESTED_AREAS,
  validateMemberInput,
  type RegisterMemberInput,
} from "@/lib/khalilabad-army-types";

interface JoinArmySectionProps {
  lang: Locale;
}

export default function JoinArmySection({ lang }: JoinArmySectionProps) {
  const isHi = lang === "hi";
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [formData, setFormData] = useState<RegisterMemberInput>({
    full_name: "",
    mobile: "",
    village_ward_area: "",
    age: "",
    interested_area: "",
    message: "",
  });

  const handleOpenForm = () => {
    setIsExpanded(true);
    // Smooth scroll down slightly so user focuses on the form
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const handleCloseForm = () => {
    setIsExpanded(false);
    setErrorMsg(null);
    setFieldErrors({});
    setTimeout(() => {
      const heroEl = document.getElementById("hero") || document.getElementById("join-army");
      if (heroEl) {
        heroEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

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
    // Clear error for that field
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

    // Validate
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

      // Success
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
      <section
        id="join-army"
        aria-labelledby="join-army-heading"
        className="surface-tint py-16 sm:py-20 md:py-28 scroll-mt-20 relative overflow-hidden"
      >
        <div className="shell">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Main Heading */}
            <h2
              id="join-army-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {isHi ? "आइए, खलीलाबाद आर्मी से जुड़ें!" : "Join Khalilabad Army!"}
            </h2>

            {/* Supporting Text */}
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {isHi
                ? "खलीलाबाद के बेहतर भविष्य, सामाजिक सहयोग और सकारात्मक बदलाव की इस पहल में आपकी भागीदारी महत्वपूर्ण है। आइए, मिलकर अपने क्षेत्र के विकास में योगदान दें।"
                : "Join Khalilabad Army and become a part of the initiative for a better future for Khalilabad."}
            </p>

            {/* CTA Button (Shown when form is collapsed) */}
            {!isExpanded && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenForm}
                  className="group inline-flex items-center gap-3 rounded-md bg-red-dk px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-deep hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-dk cursor-pointer"
                >
                  <span>{isHi ? "अभी जुड़ें" : "Join Now"}</span>
                  <svg
                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Expandable Form Container */}
          <div
            ref={formContainerRef}
            className={`transition-all duration-700 ease-in-out ${
              isExpanded
                ? "mt-12 max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
            }`}
          >
            <div className="mx-auto max-w-2xl rounded-2xl border border-line/80 bg-white p-5 shadow-raised sm:rounded-3xl sm:p-10">
              {/* SUCCESS CONFIRMATION VIEW */}
              {successData ? (
                <div className="text-center py-4">
                  {/* Green Success Badge */}
                  <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-50 text-green-dk ring-8 ring-green-50/50">
                    <svg
                      className="size-9"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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

                  {/* Unique Registration ID Display */}
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

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-green-dk px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-deep cursor-pointer"
                    >
                      {isHi ? "वापस जाएँ" : "Done"}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gray-50 cursor-pointer"
                    >
                      {isHi ? "अन्य सदस्य जोड़ें" : "Register Another"}
                    </button>
                  </div>
                </div>
              ) : (
                /* REGISTRATION FORM VIEW */
                <form onSubmit={handleSubmit} noValidate>
                  {/* Form Header */}
                  <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                        {isHi ? "सदस्यता पंजीकरण फ़ॉर्म" : "Membership Registration Form"}
                      </h3>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {isHi
                          ? "कृपया अपनी जानकारी भरें"
                          : "Please enter your details"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-gray-50 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gray-100 hover:text-red-dk cursor-pointer"
                      title={isHi ? "फ़ॉर्म बंद करें" : "Close Form"}
                      aria-label={isHi ? "फ़ॉर्म बंद करें" : "Close Form"}
                    >
                      <svg
                        className="size-4 text-ink-soft"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>
                        {isHi ? "बंद करें" : "Close"}
                      </span>
                    </button>
                  </div>

                  {/* Top Error Alert */}
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

                  <div className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-xs font-semibold text-ink sm:text-sm"
                      >
                        {isHi ? "पूरा नाम" : "Full Name"}{" "}
                        <span className="text-red-dk">*</span>
                      </label>
                      <input
                        type="text"
                        id="full_name"
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
                        <p className="mt-1 text-xs text-red-600">
                          {fieldErrors.full_name}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number & Age (2 Columns on Tablet/Desktop) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
                      {/* Mobile */}
                      <div className="sm:col-span-8">
                        <label
                          htmlFor="mobile"
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
                            id="mobile"
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
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.mobile}
                          </p>
                        )}
                      </div>

                      {/* Age (Optional) */}
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="age"
                          className="block text-xs font-semibold text-ink sm:text-sm"
                        >
                          {isHi ? "आयु" : "Age"}{" "}
                          <span className="text-xs font-normal text-ink-soft">
                            ({isHi ? "वैकल्पिक" : "optional"})
                          </span>
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="10"
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
                          <p className="mt-1 text-xs text-red-600">
                            {fieldErrors.age}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Village / Ward / Area */}
                    <div>
                      <label
                        htmlFor="village_ward_area"
                        className="block text-xs font-semibold text-ink sm:text-sm"
                      >
                        {isHi ? "गाँव / वार्ड / क्षेत्र" : "Village / Ward / Area"}{" "}
                        <span className="text-red-dk">*</span>
                      </label>
                      <input
                        type="text"
                        id="village_ward_area"
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

                    {/* Interested Area (Optional / Select) */}
                    <div>
                      <label
                        htmlFor="interested_area"
                        className="block text-xs font-semibold text-ink sm:text-sm"
                      >
                        {isHi ? "रुचि का क्षेत्र" : "Interested Area"}{" "}
                        <span className="text-xs font-normal text-ink-soft">
                          ({isHi ? "वैकल्पिक" : "optional"})
                        </span>
                      </label>
                      <select
                        id="interested_area"
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

                    {/* Message (Optional) */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-ink sm:text-sm"
                      >
                        {isHi ? "संदेश" : "Message"}{" "}
                        <span className="text-xs font-normal text-ink-soft">
                          ({isHi ? "वैकल्पिक" : "optional"})
                        </span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message ?? ""}
                        onChange={handleChange}
                        placeholder={
                          isHi
                            ? "खलीलाबाद के विकास या अपनी रुचि के बारे में कोई संदेश लिखें..."
                            : "Write any message or thoughts for Khalilabad's progress..."
                        }
                        className="mt-1.5 block w-full rounded-md border border-line bg-gray-50/50 px-3.5 py-3 text-base sm:text-sm text-ink placeholder:text-muted transition-colors focus:bg-white focus:outline-2 focus:outline-offset-1 focus:outline-red-dk min-h-[140px]"
                      />
                    </div>
                  </div>

                  {/* Submit and Close Buttons */}
                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={isLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                    >
                      {isHi ? "फॉर्म बंद करें" : "Close Form"}
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-dk px-7 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-deep disabled:opacity-60 cursor-pointer"
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
                        <span>{isHi ? "रजिस्ट्रेशन सबमिट करें" : "Submit Registration"}</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Wave tone="sand" />
    </>
  );
}
