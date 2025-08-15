"use client";

import HeroCarousel from "@/components/sections/HeroCarousel";
import { heroSlidesData } from "@/app/data";
import { useT } from "@/components/i18n";

export default function LocalizedHero() {
  const t = useT();
  const slides = heroSlidesData.map((s, idx) => {
    const key = `hero.slide${idx + 1}` as const;
    return {
      ...s,
      title: t(`${key}.title`),
      description: t(`${key}.description`),
      buttonText: t(`${key}.button`),
    };
  });
  return <HeroCarousel slides={slides} />;
}
