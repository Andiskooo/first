'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ContactButtonClient = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/contact');
  };

  return (
    <Button 
      onClick={handleClick} 
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 w-full"
    >
      Na Kontaktoni
    </Button>
  );
};

export default ContactButtonClient;
