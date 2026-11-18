'use client';

import { createContext } from 'react';
import type { SimResult } from '@/components/studio/types';

export interface StudioView {
  showThermo: boolean;
  result: SimResult | null;
  /** Flip a three-way valve to the other port and take manual control. */
  toggleThreeWay: (id: string) => void;
  /** Flip a two-way valve between open and closed, and take manual control. */
  toggleTwoWay: (id: string) => void;
}

export const StudioViewContext = createContext<StudioView>({
  showThermo: false,
  result: null,
  toggleThreeWay: () => {},
  toggleTwoWay: () => {},
});
