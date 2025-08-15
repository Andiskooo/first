'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n';

const ContactButtonClient = () => {
  const router = useRouter();
  const t = useT();

  const handleClick = () => {
    router.push('/contact-us');
  };

  return (
    <Button 
      onClick={handleClick} 
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 w-full"
    >
      {t('contact.cta', 'Na Kontaktoni')}
    </Button>
  );
};

export default ContactButtonClient;
