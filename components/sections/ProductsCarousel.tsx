'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Kaldajë me Pelet 25kW',
    category: 'Ngrohje Qendrore',
    price: '1,250.00€',
    image: '/images/product-1.jpg',
    link: '/produktet/kaldaje-pelet-25kw',
  },
  {
    id: 2,
    name: 'Klimë Inverter 12000 BTU',
    category: 'Klimatizim',
    price: '450.00€',
    image: '/images/product-2.jpg',
    link: '/produktet/klime-inverter-12000',
  },
  {
    id: 3,
    name: 'Panel Solar 400W',
    category: 'Solar',
    price: '320.00€',
    image: '/images/product-3.jpg',
    link: '/produktet/panel-solar-400w',
  },
  {
    id: 4,
    name: 'Pompa e Nxehtësisë 8kW',
    category: 'Ngrohje Qendrore',
    price: '2,100.00€',
    image: '/images/product-4.jpg',
    link: '/produktet/pompa-nxehtesise-8kw',
  },
  {
    id: 5,
    name: 'Sistem Ventilimi me Rekuperim',
    category: 'Ventilim',
    price: '980.00€',
    image: '/images/product-5.jpg',
    link: '/produktet/sistem-ventilimi-rekuperim',
  },
  {
    id: 6,
    name: 'Inverter Solar 5kW',
    category: 'Solar',
    price: '1,450.00€',
    image: '/images/product-6.jpg',
    link: '/produktet/inverter-solar-5kw',
  },
  {
    id: 7,
    name: 'Radiator Alumini 10 Elementë',
    category: 'Ngrohje Qendrore',
    price: '180.00€',
    image: '/images/product-7.jpg',
    link: '/produktet/radiator-alumini-10-elemente',
  },
];

const ProductsCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12"> {/* Reduced padding */}

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Produktet Tona</h2>
            <p className="text-lg text-slate-600">
              Zgjidhje të avancuara për nevojat tuaja
            </p>
          </div>
          <Link href="/produktet" className="text-blue-600 font-medium flex items-center gap-1 group">
            Shiko të gjitha
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div 
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="overflow-hidden h-full border border-slate-200 flex flex-col bg-transparent">
                    <CardContent className="p-0 flex-grow flex flex-col">
                      <div className="relative w-full" style={{ height: '280px' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-scale-down p-0"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-blue-600 mb-1">{product.category}</div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="font-bold text-xl">{product.price}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button asChild className="w-full">
                        <Link href={product.link}>Shiko Detajet</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end gap-2 mt-8">
            <CarouselPrevious className="static transform-none" />
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-blue-600 scale-125" : "bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductsCarousel;
