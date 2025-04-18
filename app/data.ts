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
      description: 'Ujë i Ngrohtë, Fatura të Ftohta!',
      buttonText: 'Eksploro Zgjidhjet',
      buttonLink: '/kategorit/ngrohje-qendrore',
    },
    {
      id: 2,
      image: '/hero/klima.png',
      title: 'Klima Candy A+++',
      description: ' Ngrohje me Kursim Maksimal!',
      buttonText: 'Shiko Produktet',
      buttonLink: '/kategorit/klimatizim',
    },
    {
      id: 3,
      image: '/hero/kalldaja.png',
      title: 'Kalldaja ECO TEK',
      description: 'Ngrohje Pa Kompromis!',
      buttonText: 'Shiko Produktet',
      buttonLink: '/produkte/kalldaja',
    },
    {
      id: 4,
      image: '/hero/pompa-termike.png',
      title: 'Pompa ECO TEK R290',
      description: 'Fuqi e Pastër, Kursim Ekstrem!',
      buttonText: 'Eksploro Zgjidhjet',
      buttonLink: '/produkte/pompa-termike',
    },
    {
      id: 5,
      image: '/hero/servisim.jpg',
      title: 'Shërbime Profesionale të Instalimit',
      description: 'Ekipi ynë i kualifikuar siguron instalim dhe mirëmbajtje të përsosur',
      buttonText: 'Kontakto Tani',
      buttonLink: '/servisim',
    },
  ];