'use client';

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    title: 'Ngrohje Qëndrore',
    description: 'Kompetencë dhe Efikasitet në Menaxhimin e Energjisë.',
    icon: (
      <Image src="/icons/heat-pump.svg" alt="Ngrohje Qëndrore" width={64} height={64} className="text-orange-500 group-hover:text-orange-600 transition-colors" />
    ),
    link: '/categories/ngrohje-qendrore',
    color: 'text-orange-500 group-hover:text-orange-600',
    bgColor: 'bg-orange-50 group-hover:bg-orange-100',
    borderColor: 'border-orange-500/50 group-hover:border-orange-600/50',
  },
  {
    id: 2,
    title: 'Klimatizim/Ventilim',
    description: 'Ekspertët për Freski dhe Rehati në Shtëpinë Tuaj.',
    icon: (
      <Image src="/icons/hvac.svg" alt="Klimatizim/Ventilim" width={64} height={64} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
    ),
    link: '/categories/klimatizim',
    color: 'text-blue-500 group-hover:text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    borderColor: 'border-blue-500/50 group-hover:border-blue-600/50',
  },
  {
    id: 3,
    title: 'Sanitari',
    description: 'Zgjidhje sanitare dhe higjienike për shtëpinë tuaj.',
    icon: (
      <Image src="/icons/boiler.svg" alt="Sanitari" width={64} height={64} className="text-green-500 group-hover:text-green-600 transition-colors" />
    ),
    link: '/categories/sanitari',
    color: 'text-green-500 group-hover:text-green-600',
    bgColor: 'bg-green-50 group-hover:bg-green-100',
    borderColor: 'border-green-500/50 group-hover:border-green-600/50',
  },
  {
    id: 4,
    title: 'Instalim/Servisim',
    description: 'Profesionalizëm dhe siguri për ambientin tuaj.',
    icon: (
      <Image src="/icons/service.svg" alt="Instalim/Servisim" width={64} height={64} className="text-gray-500 group-hover:text-gray-600 transition-colors" />
    ),
    link: '/categories/instalim-servisim',
    color: 'text-gray-500 group-hover:text-gray-600',
    bgColor: 'bg-gray-100 group-hover:bg-gray-200',
    borderColor: 'border-gray-500/50 group-hover:border-gray-600/50',
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
    <section className="py-12 bg-gray-100"> {/* Slight grey background */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kategorit Tona</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Zgjidhje të specializuara për çdo nevojë të shtëpisë dhe biznesit tuaj
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={category.link} className="block h-full group">
                <div className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col border-2 border-transparent hover:${category.borderColor} rounded-xl p-6 bg-white`}>
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${category.bgColor} mb-4 transition-colors`}>
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
                              Mësoni Më Shumë
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
