import type { SocialId } from "@/lib/site";

type IconProps = { className?: string };

/* ---------- Social ---------- */

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.19L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}

export const socialIcons: Record<SocialId, (p: IconProps) => React.JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YoutubeIcon,
};

/* ---------- Interface (stroke icons, 24px grid) ---------- */

function Stroke({ className, children, width = 2 }: IconProps & { children: React.ReactNode; width?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const ArrowRight = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
);
export const ArrowUpRight = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Stroke>
);
export const ArrowDown = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Stroke>
);
export const ChevronDown = ({ className }: IconProps) => (
  <Stroke className={className} width={1.75}>
    <path d="M6 9l6 6 6-6" />
  </Stroke>
);
export const ChevronLeft = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M15 6l-6 6 6 6" />
  </Stroke>
);
export const ChevronRight = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M9 6l6 6-6 6" />
  </Stroke>
);
export const MenuIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Stroke>
);
export const CloseIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Stroke>
);
export const PhoneIcon = ({ className }: IconProps) => (
  <Stroke className={className} width={1.8}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Stroke>
);

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}
export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ---------- Public-service interface ---------- */

export const SearchIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.6-3.6" />
  </Stroke>
);
export const CopyIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </Stroke>
);
export const LoaderIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Stroke>
);
export const MessageCircleIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
  </Stroke>
);
export const CheckCircleIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </Stroke>
);
export const InfoIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Stroke>
);
export const AlertIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 4l9 16H3L12 4z" />
    <path d="M12 10v4M12 17h.01" />
  </Stroke>
);
export const DownloadIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
  </Stroke>
);
export const ImagePlusIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M16 5h6M19 2v6" />
    <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
    <path d="M3 16l5-5 4 4 3-3 6 6" />
  </Stroke>
);
export const ShareIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
  </Stroke>
);
export const LogOutIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />
  </Stroke>
);
export const RefreshIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
  </Stroke>
);
export const IdCardIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4M14.5 10h4M14.5 13.5h3" />
  </Stroke>
);
export const ClipboardIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
  </Stroke>
);
export const TicketIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6z" />
    <path d="M14 5v14" strokeDasharray="2 3" />
  </Stroke>
);
export const PenIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1zM14 7l3 3" />
  </Stroke>
);
export const SendIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M21 3L10 14M21 3l-6.5 18-3.5-7-7-3.5L21 3z" />
  </Stroke>
);
export const FileTextIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" />
  </Stroke>
);
export const SparklesIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
  </Stroke>
);
export const GridIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </Stroke>
);
export const MessageSquarePlusIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M20 4H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4l4 4 4-4h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
    <path d="M12 8v5M9.5 10.5h5" />
  </Stroke>
);
