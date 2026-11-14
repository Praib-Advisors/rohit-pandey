import type { Scene } from "@/lib/ecardScenes";

/**
 * e-Card occasions. Each one sets the greeting and the card's colours and drawn motif. Festival
 * dates move with the Hindu calendar, so no dates are stored for festivals; fixed national days
 * carry theirs.
 */
export type Motif = "diya" | "ghat-lamps" | "sun" | "colours" | "flag" | "shiva" | "rakhi" | "kite" | "lotus" | "garland" | "scene";

export type ECardTemplate = {
  id: string;
  label: string;
  greeting: string;
  line: string;
  motif: Motif;
  /** A themed picture behind the card (see lib/ecardScenes.ts). */
  scene?: Scene;
  /** One or two sentences on what the day is. */
  detail?: string;
  /** Background top, background bottom, accent, text. */
  palette: [string, string, string, string];
  /** mm-dd for fixed national days. */
  fixed?: string;
};

export const ecardTemplates: ECardTemplate[] = [
  {
    id: "dev-deepawali",
    label: "देव दीपावली",
    greeting: "देव दीपावली की हार्दिक शुभकामनाएँ",
    line: "गंगा के घाटों पर जले दीप, हर घर में उजाला करें।",
    detail: "कार्तिक पूर्णिमा पर गंगा किनारे के घाट लाखों दीपों से जगमगा उठते हैं।",
    motif: "ghat-lamps",
    palette: ["#0a2832", "#123f4f", "#f2a51a", "#fff7e8"],
  },
  {
    id: "diwali",
    label: "दीपावली",
    greeting: "दीपावली की हार्दिक शुभकामनाएँ",
    line: "आपके घर में प्रकाश, समृद्धि और ख़ुशियाँ भरें।",
    detail: "प्रकाश का पर्व, वह दिन जब श्री राम अयोध्या लौटे।",
    motif: "diya",
    palette: ["#3a0d0a", "#7a1616", "#f2a51a", "#fff3dc"],
  },
  {
    id: "chhath",
    label: "छठ पूजा",
    greeting: "छठ महापर्व की हार्दिक शुभकामनाएँ",
    line: "छठी मइया सबके परिवार पर कृपा करें।",
    detail: "अस्त और उदय होते सूर्य को अर्घ्य, आस्था और अनुशासन के साथ।",
    motif: "sun",
    palette: ["#b84f08", "#f47216", "#ffe08a", "#fffaf0"],
  },
  {
    id: "holi",
    label: "होली",
    greeting: "होली की हार्दिक शुभकामनाएँ",
    line: "प्रेम, भाईचारे और उल्लास के रंग।",
    detail: "होलिका दहन और रंगों का पर्व: अच्छाई की बुराई पर जीत।",
    motif: "colours",
    palette: ["#5b1a6e", "#c2185b", "#ffd54f", "#fff8fb"],
  },
  {
    id: "navratri",
    label: "नवरात्रि / विजयादशमी",
    greeting: "नवरात्रि एवं विजयादशमी की शुभकामनाएँ",
    line: "माँ दुर्गा शक्ति दें, सदा सत्य की विजय हो।",
    detail: "माँ दुर्गा की नौ रातें, और अंत में विजयादशमी।",
    motif: "garland",
    palette: ["#7a1616", "#a3281a", "#f2a51a", "#fff3dc"],
  },
  {
    id: "mahashivratri",
    label: "महाशिवरात्रि",
    greeting: "महाशिवरात्रि की हार्दिक शुभकामनाएँ",
    line: "हर हर महादेव। बाबा विश्वनाथ सबका कल्याण करें।",
    detail: "शिव की महान रात्रि: उपवास, जागरण और हर हर महादेव।",
    motif: "shiva",
    palette: ["#0a1f2e", "#1d3b57", "#9fd3e6", "#f2fbff"],
  },
  {
    id: "raksha-bandhan",
    label: "रक्षाबंधन",
    greeting: "रक्षाबंधन की हार्दिक शुभकामनाएँ",
    line: "बहन का स्नेह, भाई का वचन।",
    detail: "भाई-बहन के स्नेह और रक्षा के संकल्प का पवित्र धागा।",
    motif: "rakhi",
    palette: ["#8a1b4a", "#d0456f", "#ffd27a", "#fff6f8"],
  },
  {
    id: "makar-sankranti",
    label: "मकर संक्रांति / खिचड़ी",
    greeting: "मकर संक्रांति की हार्दिक शुभकामनाएँ",
    line: "पतंगों की तरह आपकी उम्मीदें ऊँची उड़ान भरें।",
    detail: "सूर्य उत्तरायण होते हैं; उत्तर प्रदेश में खिचड़ी और दान का दिन।",
    motif: "kite",
    palette: ["#0f5d8c", "#4fb0d9", "#f2a51a", "#ffffff"],
  },
  {
    id: "ram-navami",
    label: "रामनवमी",
    greeting: "रामनवमी की हार्दिक शुभकामनाएँ",
    line: "मर्यादा पुरुषोत्तम श्री राम के आदर्श हमारा मार्ग दिखाएँ।",
    detail: "श्री राम का प्राकट्य: सत्य, कर्तव्य और रामराज्य का आदर्श।",
    motif: "scene",
    scene: "bow",
    palette: ["#5a0f0f", "#b03a0c", "#ffd27a", "#fff7e8"],
  },
  {
    id: "janmashtami",
    label: "जन्माष्टमी",
    greeting: "श्रीकृष्ण जन्माष्टमी की हार्दिक शुभकामनाएँ",
    line: "श्रीकृष्ण की बाँसुरी हर घर में आनंद भर दे।",
    detail: "श्रीकृष्ण का जन्म, और गीता का कर्म का संदेश।",
    motif: "scene",
    scene: "flute",
    palette: ["#06183a", "#0f4a8a", "#f2c14e", "#f2f8ff"],
  },
  {
    id: "eid",
    label: "ईद",
    greeting: "ईद मुबारक",
    line: "यह ईद सबके जीवन में अमन, ख़ुशी और भाईचारा लाए।",
    motif: "scene",
    scene: "crescent",
    palette: ["#06251f", "#0e3b32", "#ffe29a", "#f4fff9"],
  },
  {
    id: "christmas",
    label: "क्रिसमस",
    greeting: "क्रिसमस की हार्दिक शुभकामनाएँ",
    line: "सबके लिए शांति, प्रेम और सद्भावना।",
    motif: "scene",
    scene: "christmas",
    palette: ["#0b2a1f", "#12503a", "#ffd36b", "#ffffff"],
  },
  {
    id: "independence-day",
    label: "स्वतंत्रता दिवस",
    greeting: "स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ",
    line: "आज़ादी दिलाने वालों को शत-शत नमन।",
    detail: "15 अगस्त 1947 को भारत स्वतंत्र हुआ।",
    motif: "flag",
    palette: ["#ffffff", "#fff4e8", "#f47216", "#0a2832"],
    fixed: "08-15",
  },
  {
    id: "republic-day",
    label: "गणतंत्र दिवस",
    greeting: "गणतंत्र दिवस की हार्दिक शुभकामनाएँ",
    line: "अपने संविधान पर गर्व, अपने भारत पर गर्व।",
    detail: "26 जनवरी 1950 को भारत का संविधान लागू हुआ।",
    motif: "flag",
    palette: ["#ffffff", "#eef7f1", "#00a650", "#0a2832"],
    fixed: "01-26",
  },
  {
    id: "new-year",
    label: "नववर्ष",
    greeting: "नववर्ष की हार्दिक शुभकामनाएँ",
    line: "स्वास्थ्य, सेवा और प्रगति से भरा वर्ष।",
    motif: "lotus",
    palette: ["#0f3a48", "#1b5868", "#f2a51a", "#ffffff"],
    fixed: "01-01",
  },
  {
    id: "birthday",
    label: "जन्मदिन की बधाई",
    greeting: "जन्मदिन की हार्दिक बधाई",
    line: "दीर्घायु, स्वस्थ और यशस्वी जीवन की कामना।",
    motif: "garland",
    palette: ["#b84f08", "#e8630a", "#ffe08a", "#fffaf0"],
  },
];
