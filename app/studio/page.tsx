import StudioLoader from '@/components/studio/StudioLoader';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Studio hidraulike',
  'Ndërtoni një skemë ngrohjeje me pompë termike, depozitë dhe konsumatorë, pastaj shikoni si qarkullon uji dhe si ndryshon temperatura.',
  '/studio',
);

export default function StudioPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="sr-only">Studio hidraulike — skemë ngrohjeje me pompë termike</h1>
      <div className="min-h-0 flex-1">
        <StudioLoader />
      </div>
    </div>
  );
}
