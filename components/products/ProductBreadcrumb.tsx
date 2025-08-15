"use client";

import Link from "next/link";
import { useT } from "@/components/i18n";

interface ProductBreadcrumbProps {
  categoryId: string;
  productTitle: string;
}

export default function ProductBreadcrumb({ categoryId, productTitle }: ProductBreadcrumbProps) {
  const t = useT();
  const categoryTitleFallback = categoryId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="bg-gray-100 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            {t("categories.home", "Kryefaqja")}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${categoryId}`} className="hover:text-blue-600">
            {t(`nav.cat.${categoryId}.title`, categoryTitleFallback)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{productTitle}</span>
        </div>
      </div>
    </div>
  );
}
