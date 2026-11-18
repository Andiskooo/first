'use client';

import { createContext } from 'react';
import type { SimResult } from '@/components/studio/types';

export interface StudioView {
  showThermo: boolean;
  result: SimResult | null;
}

export const StudioViewContext = createContext<StudioView>({ showThermo: false, result: null });
