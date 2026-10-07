import type { Metadata } from 'next';

export const siteUrl = 'https://www.ecotek-ks.com';

export function pageMetadata(title: string, description: string, pathname: string, image?: string): Metadata {
  const url = `${siteUrl}${pathname}`;
  const images = image ? [{ url: `${siteUrl}${image}`, alt: title }] : [];
  return {
    title: `${title} | ECOTEK`, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'ECOTEK', locale: 'sq_AL', type: 'website', images },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images },
  };
}

export const businessSchema = {
  '@context': 'https://schema.org', '@type': 'HVACBusiness', '@id': `${siteUrl}/#business`,
  name: 'ECOTEK', url: siteUrl, logo: `${siteUrl}/logo.png`, image: `${siteUrl}/logo.png`,
  telephone: '+38344914480', email: 'info@ecotek-ks.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Dah Polloshka 14', addressLocality: 'Gjakovë', postalCode: '50000', addressCountry: 'XK' },
  areaServed: { '@type': 'Country', name: 'Kosovë' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  sameAs: ['https://www.facebook.com/ecotek.kosove', 'https://www.instagram.com/ecotek.ks/', 'https://www.linkedin.com/company/ecotek-ks'],
};
