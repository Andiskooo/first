'use client';

import React from 'react';
import { useT } from '@/components/i18n';

interface TProps {
  as?: React.ElementType;
  k: string; // i18n key path
  fallback?: string;
  className?: string;
  [key: string]: unknown;
}

export default function T({ as: Comp = 'span', k, fallback = '', className, ...rest }: TProps) {
  const t = useT();
  return (
    <Comp className={className} {...rest}>{t(k, fallback)}</Comp>
  );
}
