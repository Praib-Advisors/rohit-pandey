// हमारे आदर्श, the nine personalities, in the order they are shown. The order is the client's and is fixed:
// Mulayam Singh Yadav, Lohia, Ambedkar, Gandhi, Janeshwar Mishra, Karpoori Thakur, JP, Maharana Pratap, Charan Singh.
//
// RULES FOR THIS FILE
// - Every fact comes from the sources listed on the person (Wikipedia for dates and offices, the Supreme
//   Court of India, India Post / Parliament of India for images). Nothing here is invented.
// - A quotation is shown as a quotation (type "direct" or "translation") only when its wording and its
//   attribution were checked. Everything else is a "paraphrase": a plain statement of a documented position,
//   shown to visitors as "विचारों का भावार्थ" and never inside quotation marks.
// - Images are stored in /public/images/ideals/ and listed here, so replacing one is a one-line change.
//   `needsBetterImage` marks a portrait supplied at low resolution; swap it for a sharper one when available.

import type { StaticImageData } from "next/image";
import ambedkar from "../../public/images/ideals/br-ambedkar.jpg";
import charanSingh from "../../public/images/ideals/chaudhary-charan-singh.jpg";
import gandhi from "../../public/images/ideals/mahatma-gandhi.jpg";
import janeshwar from "../../public/images/ideals/janeshwar-mishra.jpg";
import jp from "../../public/images/ideals/jayaprakash-narayan.jpg";
import karpoori from "../../public/images/ideals/karpoori-thakur.jpg";
import lohia from "../../public/images/ideals/ram-manohar-lohia.jpg";
import pratap from "../../public/images/ideals/maharana-pratap.jpg";
import mulayam from "../../public/images/ideals/mulayam-singh-yadav.jpg";

/** Text in both languages. */
export type Bi = { hi: string; en: string };

export type IdealQuote =
  | {
      /** Wording checked against a source. `original` is the source's own wording (English). */
      type: "direct" | "translation";
      original: string;
      text: Bi;
      sourceTitle: string;
      sourceUrl: string;
    }
  | {
      /** A plain statement of a documented position. Never shown in quotation marks. */
      type: "paraphrase";
      text: Bi;
      sourceTitle: string;
      sourceUrl: string;
    };

export type Ideal = {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  /** "1939 - 2022" for the card. */
  years: string;
  born: Bi;
  died: Bi;
  category: Bi;
  image: StaticImageData;
  imageAlt: Bi;
  imageCredit: string;
  /** How the picture sits in the 4:5 frame. */
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  needsBetterImage?: boolean;
  quote: IdealQuote;
  /** About 40-70 words, for the card. */
  intro: Bi;
  background: Bi[];
  contributions: Bi[];
  philosophy: Bi;
  sources: { title: string; url: string }[];
};

const wiki = (title: string, path: string) => ({ title: `Wikipedia: ${title}`, url: `https://en.wikipedia.org/wiki/${path}` });

export const ideals: Ideal[] = [
  {
    id: "mulayam-singh-yadav",
    nameHindi: "श्री मुलायम सिंह यादव",
    nameEnglish: "Mulayam Singh Yadav",
    years: "1939 - 2022",
    born: { hi: "22 नवंबर 1939, सैफई (इटावा), उत्तर प्रदेश", en: "22 November 1939, Saifai (Etawah), Uttar Pradesh" },
    died: { hi: "10 अक्टूबर 2022", en: "10 October 2022" },
    category: { hi: "समाजवादी राजनीति", en: "Socialist politics" },
    image: mulayam,
    imageAlt: { hi: "श्री मुलायम सिंह यादव का चित्र", en: "Portrait of Shri Mulayam Singh Yadav" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "paraphrase",
      text: {
        hi: "समाजवादी विचार को आधार बनाकर उन्होंने छह दशकों से अधिक लंबे राजनीतिक जीवन में उत्तर प्रदेश और देश की राजनीति में सक्रिय भूमिका निभाई।",
        en: "Building on socialist thought, he played an active role in the politics of Uttar Pradesh and the country over a public life of more than six decades.",
      },
      sourceTitle: "Wikipedia: Mulayam Singh Yadav",
      sourceUrl: "https://en.wikipedia.org/wiki/Mulayam_Singh_Yadav",
    },
    intro: {
      hi: "श्री मुलायम सिंह यादव समाजवादी पार्टी के संस्थापक थे। वे उत्तर प्रदेश के तीन बार मुख्यमंत्री और देश के रक्षा मंत्री रहे। मैनपुरी, आज़मगढ़, संभल और कन्नौज से सात बार सांसद चुने गए। समर्थक उन्हें आदर से ‘नेताजी’ कहते थे। वर्ष 2023 में उन्हें मरणोपरांत पद्म विभूषण से सम्मानित किया गया।",
      en: "Shri Mulayam Singh Yadav was the founder of the Samajwadi Party. He served three terms as Chief Minister of Uttar Pradesh and as the country's Defence Minister, and was elected seven times to the Lok Sabha from Mainpuri, Azamgarh, Sambhal and Kannauj. Supporters respectfully called him ‘Netaji’. In 2023 he was posthumously awarded the Padma Vibhushan.",
    },
    background: [
      {
        hi: "मुलायम सिंह यादव का जन्म 22 नवंबर 1939 को उत्तर प्रदेश के इटावा जिले के सैफई गाँव में हुआ। राजनीति में आने से पहले वे शिक्षक और व्याख्याता रहे।",
        en: "Mulayam Singh Yadav was born on 22 November 1939 in Saifai village of Etawah district, Uttar Pradesh. Before entering politics he worked as a schoolmaster and lecturer.",
      },
      {
        hi: "उनका राजनीतिक जीवन छह दशकों से अधिक का रहा। वे दस बार विधानसभा सदस्य, सात बार लोकसभा सदस्य, विधान परिषद के सदस्य और कई बार नेता प्रतिपक्ष रहे।",
        en: "His political career spanned more than six decades. He was a ten-time member of the Legislative Assembly, a seven-time Member of Parliament, a member of the Legislative Council, and Leader of the Opposition several times.",
      },
    ],
    contributions: [
      { hi: "समाजवादी पार्टी के संस्थापक।", en: "Founder of the Samajwadi Party." },
      { hi: "उत्तर प्रदेश के तीन बार मुख्यमंत्री।", en: "Three-time Chief Minister of Uttar Pradesh." },
      { hi: "भारत सरकार में रक्षा मंत्री।", en: "Union Minister of Defence in the Government of India." },
      { hi: "मैनपुरी, आज़मगढ़, संभल और कन्नौज से सात बार लोकसभा सदस्य।", en: "Seven-time Lok Sabha member from Mainpuri, Azamgarh, Sambhal and Kannauj." },
      { hi: "वर्ष 2023 में मरणोपरांत पद्म विभूषण।", en: "Posthumously awarded the Padma Vibhushan in 2023." },
    ],
    philosophy: {
      hi: "वे समाजवादी विचारधारा से जुड़े नेता के रूप में जाने गए। उनके समर्थक उन्हें ‘नेताजी’ कहकर संबोधित करते थे।",
      en: "He was known as a leader of the socialist stream of thought. His supporters addressed him as ‘Netaji’.",
    },
    sources: [wiki("Mulayam Singh Yadav", "Mulayam_Singh_Yadav")],
  },
  {
    id: "ram-manohar-lohia",
    nameHindi: "डॉ. राममनोहर लोहिया",
    nameEnglish: "Ram Manohar Lohia",
    years: "1910 - 1967",
    born: { hi: "23 मार्च 1910, अकबरपुर (वर्तमान अंबेडकर नगर), उत्तर प्रदेश", en: "23 March 1910, Akbarpur (present-day Ambedkar Nagar), Uttar Pradesh" },
    died: { hi: "12 अक्टूबर 1967", en: "12 October 1967" },
    category: { hi: "समाजवादी चिंतन", en: "Socialist thought" },
    image: lohia,
    imageAlt: { hi: "डॉ. राममनोहर लोहिया का श्वेत-श्याम चित्र", en: "Black-and-white portrait of Dr. Ram Manohar Lohia" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "paraphrase",
      text: {
        hi: "वर्ष 1963 में उन्होंने ‘सप्तक्रांति’ का विचार रखा: स्त्री-पुरुष समानता, रंग और जन्म-जाति पर आधारित असमानता की समाप्ति, विदेशी प्रभाव से स्वतंत्रता, आर्थिक समानता, निजी जीवन की रक्षा और शस्त्रों पर नियंत्रण।",
        en: "In 1963 he put forward the idea of ‘Saptakranti’: equality of men and women, an end to inequality based on colour and birth or caste, freedom from foreign influence, economic equality, protection of private life, and limits on armaments.",
      },
      sourceTitle: "Wikipedia: Ram Manohar Lohia",
      sourceUrl: "https://en.wikipedia.org/wiki/Ram_Manohar_Lohia",
    },
    intro: {
      hi: "डॉ. राममनोहर लोहिया भारतीय स्वतंत्रता आंदोलन के सेनानी और समाजवादी चिंतक थे। वर्ष 1942 के भारत छोड़ो आंदोलन में उन्होंने गुप्त ‘कांग्रेस रेडियो’ चलाने में भूमिका निभाई। जाति-आधारित असमानता और स्त्री-पुरुष समानता पर उनके विचार आज भी चर्चा में रहते हैं। वे लोकसभा के सदस्य भी चुने गए।",
      en: "Dr. Ram Manohar Lohia was a freedom fighter and socialist thinker. During the Quit India movement of 1942 he helped run the clandestine ‘Congress Radio’. His views on caste-based inequality and equality of men and women are still discussed today. He was also elected to the Lok Sabha.",
    },
    background: [
      {
        hi: "लोहिया का जन्म 23 मार्च 1910 को उत्तर प्रदेश के अकबरपुर (वर्तमान अंबेडकर नगर) में हुआ। उन्होंने बनारस हिंदू विश्वविद्यालय से इंटरमीडिएट और कलकत्ता विश्वविद्यालय के अंतर्गत विद्यासागर कॉलेज से स्नातक किया।",
        en: "Lohia was born on 23 March 1910 at Akbarpur (present-day Ambedkar Nagar) in Uttar Pradesh. He completed his intermediate studies at Banaras Hindu University and his B.A. at Vidyasagar College, under the University of Calcutta.",
      },
      {
        hi: "भारत छोड़ो आंदोलन (1942) में गांधीजी और नेहरू की गिरफ्तारी के बाद वे प्रमुख नेताओं में उभरे। उन्होंने कलकत्ता और बंबई में गुप्त ‘कांग्रेस रेडियो’ केंद्र स्थापित किए। वर्ष 1944 में उन्हें लाहौर किले में कैद किया गया और 11 अप्रैल 1946 को रिहा किया गया।",
        en: "After the arrests of Gandhi and Nehru in the Quit India movement (1942), he emerged as an important leader. He set up clandestine ‘Congress Radio’ stations in Calcutta and Bombay. He was imprisoned in Lahore Fort in 1944 and released on 11 April 1946.",
      },
    ],
    contributions: [
      { hi: "वर्ष 1934 में कांग्रेस सोशलिस्ट पार्टी की स्थापना में सहयोग।", en: "Helped found the Congress Socialist Party in 1934." },
      { hi: "वर्ष 1949 में स्थापित हिंद किसान पंचायत के पहले अध्यक्ष।", en: "First president of the Hind Kisan Panchayat, founded in 1949." },
      { hi: "वर्ष 1955 में सोशलिस्ट पार्टी की स्थापना में भूमिका (हैदराबाद)।", en: "Played a part in founding the Socialist Party in 1955 (Hyderabad)." },
      { hi: "फर्रुखाबाद (1963 उपचुनाव) और कन्नौज (1967) से लोकसभा सदस्य।", en: "Lok Sabha member from Farrukhabad (1963 by-election) and Kannauj (1967)." },
      { hi: "वर्ष 1963 में ‘सप्तक्रांति’ का विचार।", en: "Proposed the idea of ‘Saptakranti’ (seven revolutions) in 1963." },
    ],
    philosophy: {
      hi: "लोहिया का मानना था कि जाति-आधारित असमानता समाप्त होनी चाहिए। ‘रोटी और बेटी’ के अपने विचार में उन्होंने कहा कि पहले जातियों के बीच साथ भोजन हो, फिर अंतरजातीय विवाह। वे स्त्री-पुरुष समानता के पक्षधर थे, पिछड़ों के लिए विशेष अवसर का समर्थन करते थे और अंग्रेज़ी के अत्यधिक प्रयोग के विरुद्ध अभियान चलाते थे।",
      en: "Lohia held that caste-based inequality must be abolished. In his ‘roti and beti’ idea, people should first share food across castes and then allow inter-caste marriage. He stood for equality of men and women, supported special opportunity for the backward sections, and campaigned against extensive use of English.",
    },
    sources: [wiki("Ram Manohar Lohia", "Ram_Manohar_Lohia")],
  },
  {
    id: "br-ambedkar",
    nameHindi: "डॉ. भीमराव अंबेडकर",
    nameEnglish: "B. R. Ambedkar",
    years: "1891 - 1956",
    born: { hi: "14 अप्रैल 1891", en: "14 April 1891" },
    died: { hi: "6 दिसंबर 1956", en: "6 December 1956" },
    category: { hi: "संविधान एवं सामाजिक सुधार", en: "The Constitution and social reform" },
    image: ambedkar,
    imageAlt: { hi: "डॉ. भीमराव अंबेडकर का चित्र (चित्रकला)", en: "Painted portrait of Dr. Bhimrao Ambedkar" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "translation",
      original: "Political democracy cannot last unless there lies at the base of it social democracy.",
      text: {
        hi: "राजनीतिक लोकतंत्र तब तक टिक नहीं सकता, जब तक उसके आधार में सामाजिक लोकतंत्र न हो।",
        en: "Political democracy cannot last unless there lies at the base of it social democracy.",
      },
      sourceTitle: "Supreme Court of India: Ambedkar's Constituent Assembly speech, 25 November 1949",
      sourceUrl: "https://api.sci.gov.in/AMB/Speech.php",
    },
    intro: {
      hi: "डॉ. भीमराव अंबेडकर न्यायविद्, अर्थशास्त्री, समाज सुधारक और राजनेता थे। उन्होंने उस समिति की अध्यक्षता की जिसने भारत का संविधान तैयार किया, और स्वतंत्र भारत के पहले मंत्रिमंडल में विधि एवं न्याय मंत्री रहे। दलितों के राजनीतिक अधिकारों और सामाजिक स्वतंत्रता के लिए उनका संघर्ष इतिहास में दर्ज है।",
      en: "Dr. Bhimrao Ambedkar was a jurist, economist, social reformer and politician. He chaired the committee that drafted the Constitution of India and served as Law and Justice Minister in independent India's first cabinet. His struggle for the political rights and social freedom of Dalits is recorded in history.",
    },
    background: [
      {
        hi: "अंबेडकर ने एल्फिन्स्टन कॉलेज (बंबई विश्वविद्यालय) से स्नातक किया, फिर कोलंबिया विश्वविद्यालय और लंदन स्कूल ऑफ इकोनॉमिक्स में अर्थशास्त्र का अध्ययन किया। उन्होंने लंदन स्कूल ऑफ इकोनॉमिक्स से 1923 में और कोलंबिया से 1927 में डॉक्टरेट प्राप्त की। उन्होंने ग्रेज़ इन, लंदन से कानून की शिक्षा भी ली।",
        en: "Ambedkar graduated from Elphinstone College (University of Bombay) and then studied economics at Columbia University and the London School of Economics, earning doctorates from the LSE in 1923 and Columbia in 1927. He also trained in law at Gray's Inn, London.",
      },
      {
        hi: "अपने आरंभिक जीवन में वे अर्थशास्त्री, प्राध्यापक और वकील रहे। बाद के जीवन में उन्होंने पत्रिकाओं का प्रकाशन किया और दलितों के राजनीतिक अधिकारों तथा सामाजिक स्वतंत्रता के लिए अभियान चलाए।",
        en: "In his early career he was an economist, professor and lawyer. Later he published journals and campaigned for the political rights and social freedom of Dalits.",
      },
    ],
    contributions: [
      { hi: "संविधान की प्रारूप समिति के अध्यक्ष।", en: "Chairman of the Drafting Committee of the Constitution." },
      { hi: "नेहरू के पहले मंत्रिमंडल में विधि एवं न्याय मंत्री।", en: "Law and Justice Minister in Nehru's first cabinet." },
      { hi: "दलितों के राजनीतिक अधिकारों और सामाजिक स्वतंत्रता के पक्ष में अभियान।", en: "Campaigned for the political rights and social freedom of Dalits." },
      { hi: "वर्ष 1956 में बौद्ध धर्म अपनाया और दलित बौद्ध आंदोलन को प्रेरित किया।", en: "Converted to Buddhism in 1956, inspiring the Dalit Buddhist movement." },
      { hi: "वर्ष 1990 में मरणोपरांत भारत रत्न।", en: "Posthumously awarded the Bharat Ratna in 1990." },
    ],
    philosophy: {
      hi: "संविधान सभा में 25 नवंबर 1949 के अपने भाषण में उन्होंने कहा कि केवल राजनीतिक लोकतंत्र से संतोष नहीं करना चाहिए, राजनीतिक लोकतंत्र को सामाजिक लोकतंत्र भी बनाना होगा। सामाजिक लोकतंत्र का अर्थ उन्होंने ऐसी जीवन-पद्धति बताया जो स्वतंत्रता, समानता और बंधुत्व को जीवन के सिद्धांत के रूप में मान्यता देती है।",
      en: "In his speech to the Constituent Assembly on 25 November 1949 he said we must not be content with mere political democracy; it must become a social democracy as well. Social democracy, he explained, means a way of life that recognises liberty, equality and fraternity as the principles of life.",
    },
    sources: [
      { title: "Supreme Court of India: Ambedkar's Constituent Assembly speeches", url: "https://api.sci.gov.in/AMB/Speech.php" },
      wiki("B. R. Ambedkar", "B._R._Ambedkar"),
    ],
  },
  {
    id: "mahatma-gandhi",
    nameHindi: "महात्मा गांधी",
    nameEnglish: "Mahatma Gandhi",
    years: "1869 - 1948",
    born: { hi: "2 अक्टूबर 1869, गुजरात", en: "2 October 1869, Gujarat" },
    died: { hi: "30 जनवरी 1948", en: "30 January 1948" },
    category: { hi: "सत्य एवं अहिंसा", en: "Truth and non-violence" },
    image: gandhi,
    imageAlt: { hi: "महात्मा गांधी का मुस्कुराता हुआ चित्र (चित्रकला)", en: "Smiling painted portrait of Mahatma Gandhi" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "translation",
      original: "Nonviolence is the first article of my faith. It is also the last article of my creed.",
      text: {
        hi: "अहिंसा मेरी आस्था का पहला अनुच्छेद है। यह मेरे पंथ का अंतिम अनुच्छेद भी है।",
        en: "Nonviolence is the first article of my faith. It is also the last article of my creed.",
      },
      sourceTitle: "Young India, 23 March 1922 (opening words of his statement at his trial), as cited on Wikiquote",
      sourceUrl: "https://en.wikiquote.org/wiki/Mahatma_Gandhi",
    },
    intro: {
      hi: "मोहनदास करमचंद गांधी, जिन्हें महात्मा गांधी कहा जाता है, ने अहिंसक प्रतिरोध के मार्ग पर चलकर भारत के स्वतंत्रता आंदोलन का नेतृत्व किया। उन्होंने सत्य और सत्याग्रह को अपने संघर्ष का आधार बनाया। उनके विचारों ने दुनिया भर के नागरिक अधिकार और स्वतंत्रता आंदोलनों को प्रेरित किया।",
      en: "Mohandas Karamchand Gandhi, known as Mahatma Gandhi, led India's independence movement through non-violent resistance, making truth and Satyagraha the basis of his struggle. His ideas inspired civil rights and freedom movements across the world.",
    },
    background: [
      {
        hi: "गांधीजी का जन्म 2 अक्टूबर 1869 को गुजरात में एक हिंदू परिवार में हुआ। उन्होंने लंदन के इनर टेम्पल से कानून की शिक्षा ली और 22 वर्ष की आयु में बार में बुलाए गए।",
        en: "Gandhi was born on 2 October 1869 in a Hindu family in Gujarat. He trained in law at the Inner Temple in London and was called to the bar at the age of 22.",
      },
      {
        hi: "वर्ष 1893 में वे दक्षिण अफ्रीका गए और वहाँ 21 वर्ष रहे, जहाँ उन्होंने नागरिक अधिकारों के अभियान में पहली बार अहिंसक प्रतिरोध अपनाया। वर्ष 1915 में, 45 वर्ष की आयु में, वे भारत लौटे और किसानों तथा श्रमिकों को संगठित कर भेदभाव और अत्यधिक भू-कर के विरुद्ध आवाज़ उठाई। वर्ष 1921 में उन्होंने भारतीय राष्ट्रीय कांग्रेस का नेतृत्व संभाला।",
        en: "In 1893 he went to South Africa, where he lived for 21 years and first used non-violent resistance in a campaign for civil rights. In 1915, aged 45, he returned to India and organised peasants and labourers against discrimination and excessive land tax. In 1921 he took over the leadership of the Indian National Congress.",
      },
    ],
    contributions: [
      { hi: "अहिंसक प्रतिरोध के माध्यम से भारत की स्वतंत्रता के अभियान का नेतृत्व।", en: "Led the campaign for India's independence through non-violent resistance." },
      { hi: "ग़रीबी दूर करने, महिलाओं के अधिकार बढ़ाने, धार्मिक और जातीय सद्भाव और अस्पृश्यता समाप्त करने के अभियान।", en: "Campaigns for easing poverty, expanding women's rights, building religious and ethnic amity, and ending untouchability." },
      { hi: "स्वराज (स्वशासन) की प्राप्ति को अपने संघर्ष का मुख्य लक्ष्य बनाना।", en: "Made swaraj (self-rule) the main aim of his struggle." },
      { hi: "दुनिया भर के नागरिक अधिकार और स्वतंत्रता आंदोलनों के लिए प्रेरणा।", en: "An inspiration for civil rights and freedom movements across the world." },
    ],
    philosophy: {
      hi: "सत्य, अहिंसा और सत्याग्रह उनके विचार और संघर्ष के केंद्र में थे। अदालत में अपने बयान में उन्होंने कहा था कि अहिंसा उनकी आस्था का पहला और पंथ का अंतिम अनुच्छेद है।",
      en: "Truth, non-violence and Satyagraha were at the centre of his thought and struggle. In his statement in court he said that non-violence was the first article of his faith and the last article of his creed.",
    },
    sources: [
      wiki("Mahatma Gandhi", "Mahatma_Gandhi"),
      { title: "Wikiquote: Mahatma Gandhi (citing Young India, 23 March 1922)", url: "https://en.wikiquote.org/wiki/Mahatma_Gandhi" },
    ],
  },
  {
    id: "janeshwar-mishra",
    nameHindi: "जनेश्वर मिश्र",
    nameEnglish: "Janeshwar Mishra",
    years: "1933 - 2010",
    born: { hi: "5 अगस्त 1933, शुभनथहीं गाँव, बलिया, उत्तर प्रदेश", en: "5 August 1933, Shubhanathahin village, Ballia, Uttar Pradesh" },
    died: { hi: "22 जनवरी 2010", en: "22 January 2010" },
    category: { hi: "समाजवादी राजनीति", en: "Socialist politics" },
    image: janeshwar,
    imageAlt: { hi: "जनेश्वर मिश्र का चित्र", en: "Portrait of Janeshwar Mishra" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    needsBetterImage: true,
    quote: {
      type: "paraphrase",
      text: {
        hi: "समाजवादी विचारधारा के प्रति अपनी प्रतिबद्धता के कारण उन्हें ‘छोटे लोहिया’ कहा गया, यानी डॉ. राममनोहर लोहिया के विचारों के अनुयायी के रूप में।",
        en: "Because of his commitment to socialist ideology he was called ‘Chhote Lohia’ (Lohia Junior), in reference to Dr. Ram Manohar Lohia.",
      },
      sourceTitle: "Wikipedia: Janeshwar Mishra",
      sourceUrl: "https://en.wikipedia.org/wiki/Janeshwar_Mishra",
    },
    intro: {
      hi: "जनेश्वर मिश्र समाजवादी पार्टी के नेता थे और संसद के सदस्य रहे। वे उत्तर प्रदेश से राज्यसभा में भी पहुँचे। विद्यार्थी जीवन में ही वे समाजवादी युवजन सभा से जुड़े और डॉ. लोहिया तथा राजनारायण से मिले। समाजवादी विचारधारा के प्रति उनकी प्रतिबद्धता के कारण उन्हें ‘छोटे लोहिया’ कहा गया।",
      en: "Janeshwar Mishra was a leader of the Samajwadi Party and a member of Parliament, and also represented Uttar Pradesh in the Rajya Sabha. As a student he joined the Samajwadi Yuvajan Sabha and met Dr. Lohia and Raj Narain. His commitment to socialist ideology earned him the name ‘Chhote Lohia’.",
    },
    background: [
      {
        hi: "उनका जन्म 5 अगस्त 1933 को बलिया जिले के शुभनथहीं गाँव में हुआ। उन्होंने बी.ए. और एल.एल.बी. की शिक्षा प्राप्त की। वे पूर्णानंद इंटर कॉलेज के छात्र संघ के अध्यक्ष रहे और इलाहाबाद विश्वविद्यालय में भी पढ़े।",
        en: "He was born on 5 August 1933 in Shubhanathahin village, Ballia district. He studied B.A. and LL.B., was president of the student union of Purnanand Inter College, and also attended Allahabad University.",
      },
      {
        hi: "छात्र जीवन में ही वे समाजवादी युवजन सभा से जुड़े और डॉ. राममनोहर लोहिया तथा राजनारायण से उनकी भेंट हुई।",
        en: "While still a student he joined the Samajwadi Yuvajan Sabha and met Dr. Ram Manohar Lohia and Raj Narain.",
      },
    ],
    contributions: [
      { hi: "प्रयागराज (इलाहाबाद) क्षेत्र से तीन बार लोकसभा सदस्य; 1977 में उन्होंने वी. पी. सिंह को लगभग 90,000 मतों से हराया।", en: "Three-time Lok Sabha member from the Prayagraj (Allahabad) region; in 1977 he defeated V. P. Singh by almost 90,000 votes." },
      { hi: "छठी लोकसभा (1977-80) और नौवीं लोकसभा (1989-91) के सदस्य।", en: "Member of the Sixth Lok Sabha (1977-80) and the Ninth Lok Sabha (1989-91)." },
      { hi: "उत्तर प्रदेश से राज्यसभा के सदस्य।", en: "Member of the Rajya Sabha from Uttar Pradesh." },
      { hi: "केंद्र सरकार में मंत्री के रूप में कार्य।", en: "Served as a Union Minister." },
    ],
    philosophy: {
      hi: "वे डॉ. लोहिया की समाजवादी विचार-परंपरा से जुड़े रहे। इसी निष्ठा के कारण समाज में उन्हें ‘छोटे लोहिया’ के नाम से जाना गया।",
      en: "He remained attached to the socialist tradition of Dr. Lohia, and for this reason was known in society as ‘Chhote Lohia’.",
    },
    sources: [wiki("Janeshwar Mishra", "Janeshwar_Mishra")],
  },
  {
    id: "karpoori-thakur",
    nameHindi: "जननायक कर्पूरी ठाकुर",
    nameEnglish: "Karpoori Thakur",
    years: "1924 - 1988",
    born: { hi: "24 जनवरी 1924, पितौंझिया (अब कर्पूरी ग्राम), समस्तीपुर, बिहार", en: "24 January 1924, Pitaunjhia (now Karpuri Gram), Samastipur, Bihar" },
    died: { hi: "17 फरवरी 1988", en: "17 February 1988" },
    category: { hi: "सामाजिक न्याय", en: "Social justice" },
    image: karpoori,
    imageAlt: { hi: "जननायक कर्पूरी ठाकुर का श्वेत-श्याम चित्र", en: "Black-and-white portrait of Jan Nayak Karpoori Thakur" },
    imageCredit: "Image supplied by the website owner",
    quote: {
      type: "paraphrase",
      text: {
        hi: "पिछड़े वर्गों के लिए सरकारी नौकरियों में आरक्षण की व्यवस्था उनके कार्यकाल की एक प्रमुख पहचान रही, जिसमें मुंगेरी लाल आयोग की सिफारिशों का उल्लेख मिलता है।",
        en: "The provision of reservation in government jobs for backward classes was a defining feature of his tenure, with reports pointing to the recommendations of the Mungeri Lal Commission.",
      },
      sourceTitle: "Deccan Herald: 10 things to know about Karpoori Thakur",
      sourceUrl: "https://www.deccanherald.com/amp/story/india%2Fbihar%2F10-things-to-know-about-bharat-ratna-awardee-former-bihar-cm-karpoori-thakur-2861283",
    },
    intro: {
      hi: "कर्पूरी ठाकुर, जिन्हें ‘जननायक’ कहा जाता है, बिहार के 11वें मुख्यमंत्री थे। वे दिसंबर 1970 से जून 1971 और जून 1977 से अप्रैल 1979 तक मुख्यमंत्री रहे। भारत छोड़ो आंदोलन में भाग लेने पर उन्हें 26 महीने जेल में रहना पड़ा। वर्ष 2024 में उन्हें मरणोपरांत भारत रत्न दिया गया।",
      en: "Karpoori Thakur, known as ‘Jan Nayak’, was the 11th Chief Minister of Bihar, serving from December 1970 to June 1971 and from June 1977 to April 1979. He spent 26 months in prison for taking part in the Quit India movement. In 2024 he was posthumously awarded the Bharat Ratna.",
    },
    background: [
      {
        hi: "उनका जन्म 24 जनवरी 1924 को समस्तीपुर जिले (बिहार) के पितौंझिया गाँव में हुआ, जो अब कर्पूरी ग्राम कहलाता है। वे महात्मा गांधी और सत्यनारायण सिन्हा से प्रभावित थे।",
        en: "He was born on 24 January 1924 in Pitaunjhia village, Samastipur district, Bihar, now called Karpuri Gram. He was influenced by Mahatma Gandhi and Satyanarayan Sinha.",
      },
      {
        hi: "विद्यार्थी जीवन में ही वे अखिल भारतीय छात्र संघ से जुड़े और भारत छोड़ो आंदोलन में शामिल होने के लिए कॉलेज छोड़ दिया। स्वतंत्रता के बाद उन्होंने अपने गाँव के विद्यालय में शिक्षक के रूप में कार्य किया और 1952 में सोशलिस्ट पार्टी के प्रत्याशी के रूप में ताजपुर से बिहार विधानसभा के सदस्य बने।",
        en: "As a student he joined the All India Students Federation and left college to take part in the Quit India movement. After independence he worked as a teacher in his village school and in 1952 became a member of the Bihar Vidhan Sabha from Tajpur as a Socialist Party candidate.",
      },
    ],
    contributions: [
      { hi: "बिहार के मुख्यमंत्री (दिसंबर 1970 - जून 1971 और जून 1977 - अप्रैल 1979)।", en: "Chief Minister of Bihar (December 1970 - June 1971 and June 1977 - April 1979)." },
      { hi: "पिछड़े वर्गों के लिए सरकारी नौकरियों में आरक्षण की व्यवस्था।", en: "Reservation in government jobs for backward classes." },
      { hi: "भारत छोड़ो आंदोलन में भागीदारी; 26 महीने की कैद।", en: "Took part in the Quit India movement; imprisoned for 26 months." },
      { hi: "वर्ष 2024 में मरणोपरांत भारत रत्न।", en: "Posthumously awarded the Bharat Ratna in 2024." },
    ],
    philosophy: {
      hi: "उनकी राजनीति सामाजिक न्याय और वंचित समुदायों के अधिकारों पर केंद्रित रही। जनता के बीच उनकी लोकप्रियता के कारण उन्हें ‘जननायक’ कहा गया।",
      en: "His politics centred on social justice and the rights of disadvantaged communities. His popularity among the people earned him the title ‘Jan Nayak’.",
    },
    sources: [
      wiki("Karpoori Thakur", "Karpoori_Thakur"),
      { title: "Deccan Herald: 10 things to know about Karpoori Thakur", url: "https://www.deccanherald.com/amp/story/india%2Fbihar%2F10-things-to-know-about-bharat-ratna-awardee-former-bihar-cm-karpoori-thakur-2861283" },
    ],
  },
  {
    id: "jayaprakash-narayan",
    nameHindi: "लोकनायक जयप्रकाश नारायण",
    nameEnglish: "Jayaprakash Narayan",
    years: "1902 - 1979",
    born: { hi: "11 अक्टूबर 1902, सिताब दियारा (वर्तमान बलिया), उत्तर प्रदेश", en: "11 October 1902, Sitab Diara (present-day Ballia), Uttar Pradesh" },
    died: { hi: "8 अक्टूबर 1979", en: "8 October 1979" },
    category: { hi: "लोकतांत्रिक आंदोलन", en: "Democratic movements" },
    image: jp,
    imageAlt: { hi: "लोकनायक जयप्रकाश नारायण का श्वेत-श्याम चित्र", en: "Black-and-white portrait of Lok Nayak Jayaprakash Narayan" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    needsBetterImage: true,
    quote: {
      type: "paraphrase",
      text: {
        hi: "5 जून 1974 को पटना के गांधी मैदान में उन्होंने ‘संपूर्ण क्रांति’ का आह्वान किया। उनके अनुसार परिवर्तन केवल सरकार बदलने तक सीमित नहीं था, बल्कि सामाजिक, आर्थिक, राजनीतिक, सांस्कृतिक, वैचारिक, शैक्षिक और आध्यात्मिक जीवन तक जाना था।",
        en: "On 5 June 1974, at Gandhi Maidan in Patna, he gave the call for ‘Total Revolution’. Change, in his view, was not limited to changing a government but had to reach social, economic, political, cultural, intellectual, educational and spiritual life.",
      },
      sourceTitle: "Drishti IAS: 50th Anniversary of Sampoorna Kranti",
      sourceUrl: "https://www.drishtiias.com/state-pcs-current-affairs/50th-anniversary-of-sampoorna-kranti/print_manually",
    },
    intro: {
      hi: "जयप्रकाश नारायण, जिन्हें ‘लोकनायक’ कहा जाता है, स्वतंत्रता सेनानी, राजनीतिक विचारक और समाजसेवी थे। वर्ष 1970 के दशक में उन्होंने ‘संपूर्ण क्रांति’ का आह्वान करते हुए तत्कालीन सरकार के विरुद्ध विपक्ष के आंदोलन का नेतृत्व किया। उन्हें 1965 में रेमन मैगसेसे पुरस्कार और 1999 में मरणोपरांत भारत रत्न मिला।",
      en: "Jayaprakash Narayan, known as ‘Lok Nayak’, was a freedom fighter, political thinker and social worker. In the 1970s he led the opposition movement against the government of the time with his call for ‘Total Revolution’. He received the Ramon Magsaysay Award in 1965 and the Bharat Ratna posthumously in 1999.",
    },
    background: [
      {
        hi: "जयप्रकाश नारायण का जन्म 11 अक्टूबर 1902 को सिताब दियारा गाँव में हुआ, जो घाघरा नदी के किनारे स्थित है और आज उत्तर प्रदेश के बलिया जिले में आता है।",
        en: "Jayaprakash Narayan was born on 11 October 1902 in Sitab Diara village, on the banks of the Ghaghara river, in what is today Ballia district of Uttar Pradesh.",
      },
      {
        hi: "वे भारत की स्वतंत्रता के आंदोलन में सक्रिय रहे और स्वतंत्रता के बाद सामाजिक सेवा तथा लोकतांत्रिक सुधारों के पक्षधर के रूप में जाने गए।",
        en: "He was active in the movement for India's independence and, after independence, became known as an advocate of social service and democratic reform.",
      },
    ],
    contributions: [
      { hi: "1970 के दशक के मध्य में ‘संपूर्ण क्रांति’ के आह्वान के साथ विपक्षी आंदोलन का नेतृत्व।", en: "Led the opposition movement of the mid-1970s with the call for ‘Total Revolution’." },
      { hi: "वर्ष 1965 में लोकसेवा के लिए रेमन मैगसेसे पुरस्कार।", en: "Ramon Magsaysay Award for public service, 1965." },
      { hi: "वर्ष 1999 में मरणोपरांत भारत रत्न।", en: "Bharat Ratna, posthumously, in 1999." },
    ],
    philosophy: {
      hi: "संपूर्ण क्रांति की अवधारणा में परिवर्तन को केवल राजनीतिक नहीं, बल्कि सामाजिक, आर्थिक, सांस्कृतिक, शैक्षिक और नैतिक जीवन से जुड़ा माना गया। इसमें आम लोगों की सक्रिय भागीदारी पर ज़ोर था।",
      en: "In the idea of Total Revolution, change was seen as touching not only politics but social, economic, cultural, educational and moral life, with an emphasis on the active participation of ordinary people.",
    },
    sources: [
      wiki("Jayaprakash Narayan", "Jayaprakash_Narayan"),
      { title: "Drishti IAS: 50th Anniversary of Sampoorna Kranti", url: "https://www.drishtiias.com/state-pcs-current-affairs/50th-anniversary-of-sampoorna-kranti/print_manually" },
    ],
  },
  {
    id: "maharana-pratap",
    nameHindi: "महाराणा प्रताप",
    nameEnglish: "Maharana Pratap",
    years: "1540 - 1597",
    born: { hi: "1540 (सटीक तिथि पर इतिहासकारों में मतभेद)", en: "1540 (the exact date is debated among historians)" },
    died: { hi: "19 जनवरी 1597", en: "19 January 1597" },
    category: { hi: "स्वाभिमान एवं संघर्ष", en: "Self-respect and struggle" },
    image: pratap,
    imageAlt: { hi: "महाराणा प्रताप का चित्र (चित्रकला)", en: "Painted portrait of Maharana Pratap" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "paraphrase",
      text: {
        hi: "अकबर की विस्तारवादी नीति के विरुद्ध उन्होंने मेवाड़ में राजपूत प्रतिरोध का नेतृत्व किया। हल्दीघाटी का युद्ध उनके संघर्ष का सबसे प्रसिद्ध अध्याय है।",
        en: "He led the Rajput resistance in Mewar against Akbar's expansionist policy. The battle of Haldighati is the best known chapter of his struggle.",
      },
      sourceTitle: "Wikipedia: Maharana Pratap",
      sourceUrl: "https://en.wikipedia.org/wiki/Maharana_Pratap",
    },
    intro: {
      hi: "महाराणा प्रताप मेवाड़ के शासक थे, जो आज के राजस्थान का हिस्सा है। उन्होंने वर्ष 1572 से 1597 तक शासन किया। मुग़ल बादशाह अकबर की विस्तारवादी नीति के विरुद्ध राजपूत प्रतिरोध का नेतृत्व करने और हल्दीघाटी के युद्ध के लिए वे जाने जाते हैं। उनका नाम साहस और स्वाभिमान से जुड़ा है।",
      en: "Maharana Pratap was the king of Mewar, in present-day Rajasthan, and ruled from 1572 until 1597. He is remembered for leading the Rajput resistance against the expansionist policy of the Mughal emperor Akbar and for the battle of Haldighati. His name is associated with courage and self-respect.",
    },
    background: [
      {
        hi: "प्रताप सिंह प्रथम, जिन्हें महाराणा प्रताप के नाम से जाना जाता है, वर्ष 1572 में मेवाड़ की गद्दी पर बैठे। मेवाड़ राजस्थान के उत्तर-पश्चिमी भाग में स्थित राज्य था।",
        en: "Pratap Singh I, popularly known as Maharana Pratap, became king of Mewar in 1572. Mewar was a kingdom in the north-western part of present-day Rajasthan.",
      },
      {
        hi: "उनके शासनकाल का केंद्रीय प्रसंग मुग़ल साम्राज्य की विस्तारवादी नीति के विरुद्ध प्रतिरोध रहा, जिसमें हल्दीघाटी का युद्ध प्रसिद्ध है। उनका निधन 19 जनवरी 1597 को हुआ।",
        en: "The central theme of his reign was resistance to the expansionist policy of the Mughal empire, of which the battle of Haldighati is the famous episode. He died on 19 January 1597.",
      },
    ],
    contributions: [
      { hi: "वर्ष 1572 से 1597 तक मेवाड़ के शासक।", en: "Ruler of Mewar from 1572 to 1597." },
      { hi: "अकबर की विस्तारवादी नीति के विरुद्ध राजपूत प्रतिरोध का नेतृत्व।", en: "Led the Rajput resistance against Akbar's expansionist policy." },
      { hi: "हल्दीघाटी के युद्ध में मेवाड़ का नेतृत्व।", en: "Led Mewar in the battle of Haldighati." },
    ],
    philosophy: {
      hi: "इतिहास और लोकस्मृति में उनका जीवन साहस, स्वतंत्रता और स्वाभिमान के प्रतीक के रूप में याद किया जाता है। (यह अनुभाग उनके जीवन के सार्वजनिक स्मरण को बताता है, उनके नाम से कोई उद्धरण नहीं।)",
      en: "In history and popular memory his life is remembered as a symbol of courage, independence and self-respect. (This note describes how his life is remembered; it is not a quotation attributed to him.)",
    },
    sources: [wiki("Maharana Pratap", "Maharana_Pratap")],
  },
  {
    id: "chaudhary-charan-singh",
    nameHindi: "चौधरी चरण सिंह",
    nameEnglish: "Chaudhary Charan Singh",
    years: "1902 - 1987",
    born: { hi: "23 दिसंबर 1902, मेरठ जिला, उत्तर प्रदेश", en: "23 December 1902, Meerut district, Uttar Pradesh" },
    died: { hi: "29 मई 1987", en: "29 May 1987" },
    category: { hi: "किसान एवं ग्रामीण अर्थव्यवस्था", en: "Farmers and the rural economy" },
    image: charanSingh,
    imageAlt: { hi: "गांधी टोपी पहने चौधरी चरण सिंह का चित्र", en: "Portrait of Chaudhary Charan Singh in a Gandhi cap" },
    imageCredit: "Image supplied by the website owner",
    imagePosition: "object-top",
    quote: {
      type: "paraphrase",
      text: {
        hi: "वे भूमि और कृषि सुधारों के लिए जाने गए और किसानों के हितों के पक्षधर के रूप में उन्हें ‘किसानों का चैंपियन’ कहा जाता है।",
        en: "He was known for land and agricultural reforms, and as an advocate of farmers' interests he is widely called the ‘Champion of Farmers’.",
      },
      sourceTitle: "Wikipedia: Charan Singh",
      sourceUrl: "https://en.wikipedia.org/wiki/Charan_Singh",
    },
    intro: {
      hi: "चौधरी चरण सिंह किसान नेता, लेखक और स्वतंत्रता सेनानी थे। वे जुलाई 1979 से जनवरी 1980 तक भारत के प्रधानमंत्री और उत्तर प्रदेश के मुख्यमंत्री रहे। भूमि और कृषि सुधारों के लिए जाने गए और बागपत से सांसद रहे। वर्ष 2024 में उन्हें मरणोपरांत भारत रत्न से सम्मानित किया गया।",
      en: "Chaudhary Charan Singh was a peasant leader, author and freedom fighter. He served as Prime Minister of India from July 1979 to January 1980 and as Chief Minister of Uttar Pradesh. Known for land and agricultural reforms, he was Member of Parliament for Baghpat. In 2024 he was posthumously awarded the Bharat Ratna.",
    },
    background: [
      {
        hi: "चरण सिंह का जन्म 23 दिसंबर 1902 को मेरठ जिले में हुआ। उन्होंने आगरा कॉलेज से बी.एससी. (1923) और इतिहास में एम.ए. (1925) किया तथा मेरठ कॉलेज से 1927 में एल.एल.बी. पूरा किया।",
        en: "Charan Singh was born on 23 December 1902 in Meerut district. He took a B.Sc. (1923) and an M.A. in history (1925) at Agra College and completed his LL.B. at Meerut College in 1927.",
      },
      {
        hi: "वे महात्मा गांधी से प्रेरित होकर स्वतंत्रता आंदोलन में आए और अहिंसक संघर्ष का मार्ग अपनाया। नमक कानून के उल्लंघन पर 1930 में उन्हें छह महीने की जेल हुई; 1940 के व्यक्तिगत सत्याग्रह में एक वर्ष की और अगस्त 1942 में भी वे जेल गए।",
        en: "Inspired by Mahatma Gandhi, he joined the freedom movement and followed non-violent struggle. He was jailed for six months in 1930 for breaking the salt laws, for one year in 1940 during the individual Satyagraha, and again in August 1942.",
      },
    ],
    contributions: [
      { hi: "जनवरी 1979 से जुलाई 1979 तक उप-प्रधानमंत्री; जुलाई 1979 से जनवरी 1980 तक प्रधानमंत्री।", en: "Deputy Prime Minister from January to July 1979; Prime Minister from July 1979 to January 1980." },
      { hi: "उत्तर प्रदेश के मुख्यमंत्री।", en: "Chief Minister of Uttar Pradesh." },
      { hi: "भूमि और कृषि सुधार संबंधी पहल; बागपत से सांसद।", en: "Land and agricultural reform initiatives; Member of Parliament for Baghpat." },
      { hi: "वर्ष 2024 में मरणोपरांत भारत रत्न (घोषणा 9 फरवरी, अलंकरण 30 मार्च 2024)।", en: "Posthumously awarded the Bharat Ratna in 2024 (announced 9 February, conferred 30 March 2024)." },
    ],
    philosophy: {
      hi: "उनका सार्वजनिक जीवन किसानों के हितों, कृषि और ग्रामीण अर्थव्यवस्था के प्रश्नों के इर्द-गिर्द रहा। उन्हें ‘किसानों का चैंपियन’ कहा जाता है।",
      en: "His public life revolved around the interests of farmers, agriculture and the rural economy. He is called the ‘Champion of Farmers’.",
    },
    sources: [
      wiki("Charan Singh", "Charan_Singh"),
      { title: "The South First: President confers Bharat Ratna on Charan Singh and others (30 March 2024)", url: "https://thesouthfirst.com/news/president-confers-bharat-ratna-on-ex-pms-narasimha-rao-charan-singh-2-others-posthumously" },
    ],
  },
];

export const idealBySlug = (slug: string) => ideals.find((p) => p.id === slug);

/** Quotes whose wording was checked: the only ones eligible for the "आज का विचार" block. */
export const featuredPool = ideals.filter((p) => p.quote.type !== "paraphrase");

/** The name in both languages, for `<TB v={nameOf(person)} />`. */
export const nameOf = (p: Ideal): Bi => ({ hi: p.nameHindi, en: p.nameEnglish });
