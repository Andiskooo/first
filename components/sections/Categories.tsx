'use client';

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    title: 'Ngrohje Qëndrore',
    description: 'Kompetencë dhe Efikasitet në Menaxhimin e Energjisë.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 group-hover:text-orange-600 transition-colors">
        <path d="M8 14a5 5 0 0 0 10 0M8 14a5 5 0 0 1 10 0"/>
        <path d="M17 18.5a9 9 0 1 0-10 0"/>
        <path d="M12 12v4"/>
        <path d="M12 3v3"/>
      </svg>
    ),
    link: '/kategorit/ngrohje-qendrore',
    color: 'text-orange-500 group-hover:text-orange-600',
  },
  {
    id: 2,
    title: 'Klimatizim/Ventilim',
    description: 'Ekspertët për Freski dhe Rehati në Shtëpinë Tuaj.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:text-blue-600 transition-colors">
        <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"/>
        <path d="M12 7v10"/>
        <path d="m8 9 8 6"/>
        <path d="m16 9-8 6"/>
      </svg>
    ),
    link: '/kategorit/klimatizim',
    color: 'text-blue-500 group-hover:text-blue-600',
  },
  {
    id: 3,
    title: 'Instalim dhe Servisim',
    description: 'Profesionalizëm dhe siguri për ambientin tuaj.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:text-blue-600 transition-colors">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    link: '/kategorit/instalim-servisim',
    color: 'text-blue-500 group-hover:text-blue-600',
  },
];

const Categories = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 bg-white"> {/* Reduced padding */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kategorit Tona</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Zgjidhje të specializuara për çdo nevojë të shtëpisë dhe biznesit tuaj
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={category.link} className="block h-full group">
                <div className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col rounded-lg p-6 bg-white">
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-slate-50 mb-4 transition-colors">
                      {category.icon}
                    </div>
                    <CardTitle className={`text-xl font-bold ${category.color}`}>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-slate-600 text-center">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-center pt-4 pb-6">
                    <div className={`${category.color} font-medium relative h-6 w-auto inline-flex justify-center items-center min-w-[150px]`}> {/* Added min-width to prevent jumpiness */}
                      {/* Initial State: Arrow centered */}
                      <div className="transition-opacity duration-200 opacity-100 group-hover:opacity-0 group-hover:invisible">
                           <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           >
                              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                           </svg>
                      </div>

                      {/* Hover State: Text + Arrow */}
                      <div className="absolute inset-0 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                          <span className="text-current font-medium whitespace-nowrap transition-transform duration-300 ease-in-out transform -translate-x-2 group-hover:translate-x-0">
                              More Information
                          </span>
                          <div className="transition-transform duration-300 ease-in-out transform translate-x-2 group-hover:translate-x-0"> {/* Wrapper for SVG */}
                              <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              >
                                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                              </svg>
                          </div>
                      </div>
                  </div>
                  </CardFooter>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
