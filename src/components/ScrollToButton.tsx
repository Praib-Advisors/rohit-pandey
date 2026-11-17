"use client";

import type { MouseEvent } from "react";

type Props = {
  targetId: string;
  label: string;
  className?: string;
};

export default function ScrollToButton({
  targetId,
  label,
  className = "",
}: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={className}
      role="button"
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-3.5 sm:size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </a>
  );
}

