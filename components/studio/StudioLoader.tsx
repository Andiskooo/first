'use client';

import dynamic from 'next/dynamic';

const StudioApp = dynamic(() => import('@/components/studio/StudioApp'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-slate-500">Duke ngarkuar studion…</div>
  ),
});

export default function StudioLoader() {
  return <StudioApp />;
}
