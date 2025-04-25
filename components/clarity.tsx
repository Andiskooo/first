// components/analytics/ClarityAnalytics.tsx
'use client';

import { useEffect } from 'react';
import Clarity  from '@microsoft/clarity';

const ClarityAnalytics = () => {
  useEffect(() => {
    // You should ideally use an environment variable here
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "r9jw0j8k1w";
    if (projectId && typeof window !== 'undefined') {
      Clarity.init(projectId);
      // You can add more clarity features here if needed, like identify
      // clarity.identify('USER_ID', { userProperty: 'value' });
    }
  }, []);

  return null; // This component doesn't render any UI
};

export default ClarityAnalytics;