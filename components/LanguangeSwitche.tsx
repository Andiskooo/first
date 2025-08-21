"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";

const labels: Record<"sq" | "de" | "en", string> = {
  sq: "SQ",
  de: "DE",
  en: "EN",
};

// Simple flag mapping using FlagCDN 24px PNGs (lightweight). Adjust if you prefer local assets.
const flagUrls: Record<keyof typeof labels, string> = {
  sq: "https://flagcdn.com/w40/al.png", // Albania
  de: "https://flagcdn.com/w40/de.png", // Germany
  en: "https://flagcdn.com/w40/gb.png", // United Kingdom (English)
};

const langNames: Record<keyof typeof labels, string> = {
  sq: "Shqip",
  de: "Deutsch",
  en: "English",
};

export default function LanguangeSwitche({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "ghost";
}) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleSelect = (code: keyof typeof labels) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      {/* Trigger */}
      <Button
        size="sm"
        variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative overflow-hidden pl-12 pr-6 h-9 text-xs font-medium",
          "text-white"
        )}
      >
        {/* Flag */}
        <span
          aria-hidden
          className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-7 rounded-sm bg-center bg-cover shadow-sm"
          style={{ backgroundImage: `url(${flagUrls[locale]})` }}
        />
        {/* Label */}
        <span className="ml-1 pr-2">{langNames[locale]}</span>
        {/* Caret */}
        <span aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2">
          ▾
        </span>
      </Button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          aria-label="Language options"
          className={cn(
            "absolute z-50 mt-2 w-48 origin-top-right rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 shadow-xl",
            "focus:outline-none"
          )}
        >
          <ul className="py-1">
            {(Object.keys(labels) as Array<keyof typeof labels>).map((code) => (
              <li key={code} role="none">
                <button
                  role="menuitemradio"
                  aria-checked={locale === code}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-sm",
                    "hover:bg-zinc-700/70 focus-visible:bg-zinc-700/70 transition-colors",
                    locale === code && "bg-zinc-700/60"
                  )}
                >
                  <span
                    aria-hidden
                    className="h-5 w-7 flex-none rounded-[3px] bg-center bg-cover shadow-sm ring-1 ring-black/10"
                    style={{ backgroundImage: `url(${flagUrls[code]})` }}
                  />
                  <span className="flex-1 text-left tracking-wide">{langNames[code]}</span>
                  {locale === code && (
                    <span aria-hidden className="text-xs opacity-80">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
