// Define the type for a single slide item
export interface SlideItem {
    id: number;
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  }
  
  // Data for the main hero carousel
  export const heroSlidesData: SlideItem[] = [
    {
      id: 1,
      image: '/hero/bojleri.png',
      title: 'Boileri R290',
      description: 'Boiler i avancuar ECOPUMP R290 me efikasitet të lartë.',
      buttonText: 'Eksploro Zgjidhjet',
      buttonLink: '/categories/sanitari',
    },
    {
      id: 2,
      image: '/hero/klima.png',
      title: 'Klima Candy A+++',
      description: 'Klima Candy A+++ perfekte për verë.',
      buttonText: 'Shiko Produktet',
      buttonLink: '/categories/klimatizim-ventilim',
    },
    {
      id: 3,
      image: '/hero/kalldaja.png',
      title: 'Kalldaja ECO TEK',
      description: 'Kalldaja ECO TEK me efikasitet të lartë.',
      buttonText: 'Shiko Produktet',
      buttonLink: '/categories/ngrohje-qendrore?subcategory=kalldaja-elektrike',
    },
    {
      id: 4,
      image: '/hero/pompa-termike.png',
      title: 'Pompa ECO TEK R290',
      description: 'Fuqi e Pastër, Kursim Ekstrem!',
      buttonText: 'Eksploro Zgjidhjet',
      buttonLink: '/categories/ngrohje-qendrore?subcategory=pompa-termike',
    },
    {
      id: 5,
      image: '/hero/servisim.jpg',
      title: 'Shërbime Profesionale të Instalimit',
      description: 'Ekipi ynë i kualifikuar siguron instalim dhe mirëmbajtje të përsosur',
      buttonText: 'Kontakto Tani',
      buttonLink: '/contact-us',
  },
];