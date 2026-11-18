export type MemberStatus = "pending" | "approved" | "rejected";

export type InterestedArea =
  | "social_service"
  | "youth_activities"
  | "education_awareness"
  | "health_welfare"
  | "regional_development"
  | "other";

export interface KhalilabadArmyMember {
  id: string;
  registration_id: string;
  full_name: string;
  mobile: string;
  village_ward_area: string;
  age?: number | null;
  interested_area?: string | null;
  message?: string | null;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
}

export interface RegisterMemberInput {
  full_name: string;
  mobile: string;
  village_ward_area: string;
  age?: number | string | null;
  interested_area?: string | null;
  message?: string | null;
}

export const INTERESTED_AREAS: { id: InterestedArea; hi: string; en: string }[] = [
  { id: "social_service", hi: "सामाजिक सेवा", en: "Social Service" },
  { id: "youth_activities", hi: "युवा गतिविधियाँ", en: "Youth Activities" },
  { id: "education_awareness", hi: "शिक्षा एवं जागरूकता", en: "Education & Awareness" },
  { id: "health_welfare", hi: "स्वास्थ्य एवं जन-कल्याण", en: "Health & Public Welfare" },
  { id: "regional_development", hi: "क्षेत्रीय विकास", en: "Regional Development" },
  { id: "other", hi: "अन्य", en: "Other" },
];

export function validateMemberInput(input: RegisterMemberInput, lang: "hi" | "en" = "hi"): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.full_name || input.full_name.trim().length < 2) {
    errors.full_name =
      lang === "hi"
        ? "कृपया अपना पूरा नाम दर्ज करें।"
        : "Please enter your full name.";
  }

  const cleanMobile = String(input.mobile || "").trim().replace(/\D/g, "");
  // Indian 10-digit mobile number starting with 6, 7, 8, or 9
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!cleanMobile) {
    errors.mobile =
      lang === "hi"
        ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।"
        : "Please enter a 10-digit mobile number.";
  } else if (!mobileRegex.test(cleanMobile)) {
    errors.mobile =
      lang === "hi"
        ? "कृपया एक वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।"
        : "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).";
  }

  if (!input.village_ward_area || input.village_ward_area.trim().length < 2) {
    errors.village_ward_area =
      lang === "hi"
        ? "कृपया अपना गाँव, वार्ड या क्षेत्र दर्ज करें।"
        : "Please enter your Village, Ward, or Area.";
  }

  if (input.age !== undefined && input.age !== null && String(input.age).trim() !== "") {
    const ageNum = Number(input.age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      errors.age =
        lang === "hi"
          ? "कृपया एक वैध आयु (10-120 वर्ष) दर्ज करें।"
          : "Please enter a valid age (10-120 years).";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
