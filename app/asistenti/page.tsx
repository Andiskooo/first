import { Suspense } from 'react';
import SupportExperience from '@/components/support/SupportExperience';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Asistenti Virtual',
  'Bisedoni me asistencën virtual të ECOTEK për pompën tuaj termike — zhbllokimi i ekranit, temperatura, timerat, modalitetet dhe kodet e gabimit, në shqip. Ose shikoni video udhëzimet.',
  '/asistenti'
);

export default function AsistentiPage() {
  return (
    <Suspense>
      <SupportExperience />
    </Suspense>
  );
}
