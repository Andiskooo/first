'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Ju lutemi vendosni një email të vlefshëm');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Faleminderit për abonimin!');
        setEmail('');
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
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresa juaj e emailit"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Duke dërguar...' : 'Abonohu'}
        </button>
      </form>
    </div>
  );
}
