'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react';

// Define location data structure
interface LocationData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapUrl: string;
}

// Sample location data
const locations: LocationData[] = [
  {
    id: 'gjakove',
    name: 'ECOTEK Gjakovë',
    address: 'Rruga Dah Polloshka 14, Gjakovë 50000, Kosovë',
    phone: '+383 44 914 480',
    email: 'info@ecotek-ks.com',
    coordinates: {
      lat: 42.365867617706165,
      lng: 20.466225867526365
    },
    workingHours: {
      weekdays: 'E Hënë - E Premte: 09:00 - 17:00',
      saturday: 'E Shtunë: 09:00 - 13:00',
      sunday: 'E Diel: Mbyllur'
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1920.6320617416666!2d20.466225867526365!3d42.365867617706165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1353b1a29466cfd1%3A0x6c7d20302c8e123c!2sECOTEK!5e0!3m2!1sen!2s!4v1745607963392!5m2!1sen!2s'
  },
  {
    id: 'prishtine',
    name: 'ECOTEK Prishtinë',
    address: 'Rruga B, Prishtinë 10000, Kosovë',
    phone: '+383 45 123 456',
    email: 'prishtina@ecotek-ks.com',
    coordinates: {
      lat: 42.66400271620296,
      lng: 21.159150675949244
    },
    workingHours: {
      weekdays: 'E Hënë - E Premte: 09:00 - 17:00',
      saturday: 'E Shtunë: 09:00 - 13:00',
      sunday: 'E Diel: Mbyllur'
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.2995686635356!2d21.159150675949244!3d42.66400271620296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549ee605110927%3A0x9365bfb2c5079811!2sSkenderbeu%2C%20Pristina!5e0!3m2!1sen!2s!4v1712687456789!5m2!1sen!2s'
  }
];

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    location: 'gjakove' // Default selected location
  });

  const [activeLocation, setActiveLocation] = useState<string>(locations[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Send email using Resend API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: locations.find(loc => loc.id === formData.location)?.name || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      console.log('Email sent successfully');
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        location: activeLocation
      });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitting(false);
      alert('Ndodhi një gabim. Ju lutemi provoni përsëri.');
    }
  };

  // Get the currently active location data
  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative h-[40vh] w-full">
        <Image 
          src="/hero/contact-us.jpg"
          alt="Contact ECOTEK"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Na Kontaktoni</h1>
            <p className="text-lg md:text-xl">Jemi këtu për t&apos;ju ndihmuar me çdo pyetje dhe kërkesë</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Kontakti</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Location tabs */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Lokacionet Tona</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeLocation === location.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{location.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Large Map */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="h-[60vh] w-full">
            <iframe 
              src={currentLocation.mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={`${currentLocation.name} Location`}
            ></iframe>
          </div>
        </div>

        {/* Contact details and form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h3 className="text-2xl font-semibold mb-6 border-b pb-4">{currentLocation.name}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Adresa</h4>
                  <p className="text-gray-600">{currentLocation.address}</p>
                  <a 
                    href={`https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center mt-1 text-sm"
                  >
                    Hap në Google Maps <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Telefoni</h4>
                  <p className="text-gray-600">{currentLocation.phone}</p>
                  <a 
                    href={`tel:${currentLocation.phone.replace(/\s/g, '')}`}
                    className="text-blue-600 hover:underline inline-flex items-center mt-1 text-sm"
                  >
                    Thirr tani <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Email</h4>
                  <p className="text-gray-600">{currentLocation.email}</p>
                  <a 
                    href={`mailto:${currentLocation.email}`}
                    className="text-blue-600 hover:underline inline-flex items-center mt-1 text-sm"
                  >
                    Dërgo email <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Orari i Punës</h4>
                  <p className="text-gray-600">{currentLocation.workingHours.weekdays}</p>
                  <p className="text-gray-600">{currentLocation.workingHours.saturday}</p>
                  <p className="text-gray-600">{currentLocation.workingHours.sunday}</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium text-lg mb-4">Na ndiqni</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-md lg:col-span-2"
          >
            <h3 className="text-2xl font-semibold mb-6">Na dërgoni një mesazh</h3>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Faleminderit për mesazhin!</h4>
                <p className="mb-4">Mesazhi juaj u dërgua me sukses. Do t&apos;ju kontaktojmë së shpejti.</p>
                <Button onClick={() => setSubmitted(false)}>Dërgo një mesazh tjetër</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                      Emri i plotë <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Emri juaj i plotë"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@juaj.com"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700">
                      Numri i telefonit
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+383 44 123 456"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-700">
                      Lokacioni <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      required
                    >
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                    Mesazhi <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Shkruani mesazhin tuaj këtu..."
                    rows={6}
                    className="w-full"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-3 text-base"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Duke dërguar...
                    </>
                  ) : (
                    'Dërgo Mesazhin'
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
        <div className="w-full bg-gray-100 py-16 mt-12">
          <section className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Pyetje të Shpeshta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">Si mund të bëj një porosi?</h3>
                <p className="text-gray-600">Ju mund të bëni porosi duke na kontaktuar direkt përmes telefonit, email-it ose duke plotësuar formularin e kontaktit në këtë faqe.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">A ofron ECOTEK shërbime të instalimit?</h3>
                <p className="text-gray-600">Po, ne ofrojmë shërbime profesionale të instalimit për të gjitha produktet tona. Ekipi ynë i trajnuar siguron instalim të saktë dhe efikas.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">Sa është garancia për produktet?</h3>
                <p className="text-gray-600">Produktet tona kanë garanci që varion nga 2 deri në 5 vite, në varësi të produktit. Detajet specifike mund t&apos;i gjeni në përshkrimin e secilit produkt.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">A ofron ECOTEK shërbime të mirëmbajtjes?</h3>
                <p className="text-gray-600">Po, ne ofrojmë shërbime të rregullta të mirëmbajtjes për të gjitha produktet tona për të siguruar performancë optimale dhe jetëgjatësi.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
