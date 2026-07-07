'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Ju lutemi vendosni një email të vlefshëm');
      return;
    }

    if (!phone) {
      toast.error('Ju lutemi vendosni numrin e telefonit');
      return;
    }

    if (!consentChecked) {
      toast.error('Ju lutemi pranoni kushtet për të vazhduar');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          viberConsent: consentChecked,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Faleminderit për abonimin!');
        setEmail('');
        setPhone('');
        setConsentChecked(false);
      } else {
        toast.error(data.message || 'Diçka shkoi keq. Ju lutemi provoni përsëri.');
      }
    } catch (error) {
      toast.error('Diçka shkoi keq. Ju lutemi provoni përsëri.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-center mb-4">Ju pëlqej leximi?</h3>
      <p className="text-center text-gray-600 mb-6">
        Shkruani Emailin për të marrë njoftimet për artikujt më të fundit dhe këshilla për klimatizimin dhe ngrohjen.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresa juaj e emailit"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Numri i telefonit"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="viber-consent"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1"
            required
          />
          <label htmlFor="viber-consent" className="text-sm text-gray-700">
            Duke zgjedhur këtë kuti, pranoj të marr protokolle të zbatueshme dhe përditësime përmes Viber.
          </label>
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={isLoading || !consentChecked}
            className="w-full sm:w-auto px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Duke dërguar...' : 'Abonohu'}
          </button>
          <span className="text-xs text-gray-500">Ju mund të çregjistroheni në çdo kohë.</span>
        </div>
      </form>
    </div>
  );
}
