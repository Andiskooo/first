'use client';

import { createContext } from 'react';
import type { SimResult } from '@/components/studio/types';

export interface StudioView {
  showThermo: boolean;
  result: SimResult | null;
  /** Flip a three-way valve to the other port and take manual control. */
  toggleThreeWay: (id: string) => void;
}

export const StudioViewContext = createContext<StudioView>({
  showThermo: false,
  result: null,
  toggleThreeWay: () => {},
});
