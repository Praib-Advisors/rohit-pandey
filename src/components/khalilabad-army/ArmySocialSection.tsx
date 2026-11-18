import Wave from "@/components/Wave";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
  ArrowUpRight,
} from "@/components/icons";
import { type Locale } from "@/lib/i18n";
import { socials } from "@/lib/site";

interface ArmySocialSectionProps {
  lang: Locale;
}

export default function ArmySocialSection({ lang }: ArmySocialSectionProps) {
  const isHi = lang === "hi";

  const channels = [
    {
      id: "facebook",
      name: "Facebook",
      handle: socials.find((s) => s.id === "facebook")?.handle
        ? `@${socials.find((s) => s.id === "facebook")?.handle}`
        : "@Rohit4SP",
      url:
        socials.find((s) => s.id === "facebook")?.url ??
        "https://www.facebook.com/Rohit4SP",
      icon: FacebookIcon,
      badgeColor: "bg-[#1877F2]/10 text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white",
    },
    {
      id: "instagram",
      name: "Instagram",
      handle:
        socials.find((s) => s.id === "instagram")?.handle ?? "@rkpsocialist",
      url:
        socials.find((s) => s.id === "instagram")?.url ??
        "https://www.instagram.com/rkpsocialist/",
      icon: InstagramIcon,
      badgeColor: "bg-[#E4405F]/10 text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white",
    },
    {
      id: "youtube",
      name: "YouTube",
      handle:
        socials.find((s) => s.id === "youtube")?.handle ?? "@teamrohitpandey",
      url:
        socials.find((s) => s.id === "youtube")?.url ??
        "https://www.youtube.com/@teamrohitpandey",
      icon: YoutubeIcon,
      badgeColor: "bg-[#FF0000]/10 text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white",
    },
    {
      id: "x",
      name: "X (Twitter)",
      handle: "@PandayRohit1227",
      url:
        socials.find((s) => s.id === "x")?.url ??
        "https://x.com/PandayRohit1227",
      icon: XIcon,
      badgeColor: "bg-[#201D1D]/10 text-[#201D1D] group-hover:bg-[#201D1D] group-hover:text-white",
    },
  ].filter((item) => Boolean(item.url));

  return (
    <>
      <Wave tone="ivory" />
      <section
        id="army-social"
        aria-labelledby="army-social-heading"
        className="surface-ivory py-14 sm:py-20 md:py-28 relative overflow-hidden"
      >
        <div className="shell">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Heading and Description */}
            <div className="lg:col-span-5" data-reveal="fade">
              <h2
                id="army-social-heading"
                className="font-heading text-2xl font-bold tracking-tight text-[#201D1D] sm:text-4xl lg:text-5xl"
              >
                {isHi ? "सोशल मीडिया पर जुड़ें" : "Connect on Social Media"}
              </h2>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-ink-soft sm:text-lg">
                {isHi
                  ? "आधिकारिक सोशल मीडिया माध्यमों से जुड़े रहें और खलीलाबाद के विकास कार्यों, जनसहभागिता और कार्यक्रमों की हर नई जानकारी प्राप्त करें।"
                  : "Stay connected through official social media channels to explore community activities, public initiatives, and the latest updates for Khalilabad."}
              </p>
            </div>

            {/* Right Column: Stacked Social Media Rows with Arrow Buttons */}
            <div className="lg:col-span-7" data-reveal="fade">
              <div className="divide-y divide-line border-y border-line">
                {channels.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        isHi
                          ? `${item.name} पर जुड़ें (${item.handle})`
                          : `Connect on ${item.name} (${item.handle})`
                      }
                      className="group flex items-center justify-between py-3.5 sm:py-4.5 px-2.5 sm:px-4 -mx-2.5 sm:-mx-4 rounded-xl transition-all duration-300 hover:bg-white/80"
                    >
                      {/* Left: Icon + Name + Handle */}
                      <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                        <div
                          className={`flex size-11 sm:size-13 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-2xs ${item.badgeColor}`}
                        >
                          <Icon className="size-5 sm:size-6" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-heading text-base sm:text-xl font-bold text-[#201D1D] transition-colors duration-200 group-hover:text-[#7F1725]">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-ink-soft truncate mt-0.5">
                            {item.handle}
                          </p>
                        </div>
                      </div>

                      {/* Right: Circular Arrow Button */}
                      <div className="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-[#201D1D] shadow-2xs transition-all duration-300 group-hover:bg-[#7F1725] group-hover:text-white group-hover:border-[#7F1725] group-hover:scale-105">
                        <ArrowUpRight className="size-4 sm:size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
