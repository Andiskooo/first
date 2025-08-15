"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

const labels: Record<"sq" | "de" | "en", string> = {
  sq: "SQ",
  de: "DE",
  en: "EN",
};

export default function LanguangeSwitche({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "ghost";
}) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {(Object.keys(labels) as Array<keyof typeof labels>).map((code) => (
        <Button
          key={code}
          size="sm"
          variant={locale === code ? "default" : variant}
          className={cn(
            "px-2 py-1 h-8 text-xs",
            locale === code ? "font-semibold" : "opacity-80 hover:opacity-100"
          )}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          aria-label={`Switch language to ${code}`}
        >
          {labels[code]}
        </Button>
      ))}
    </div>
  );
}
