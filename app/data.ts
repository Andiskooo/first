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
    title: 'Zgjidhje Inovative për Ngrohje Qendrore',
    description: 'Sisteme efikase dhe të qëndrueshme për shtëpinë dhe biznesin tuaj',
    buttonText: 'Eksploro Zgjidhjet',
    buttonLink: '/kategorit/ngrohje-qendrore',
  },
  {
    id: 2,
    image: '/hero/klima.png',
    title: 'Klimatizim dhe Ventilim i Avancuar',
    description: 'Komfort optimal gjatë gjithë vitit me sistemet tona të klimatizimit',
    buttonText: 'Shiko Produktet',
    buttonLink: '/kategorit/klimatizim',
  },
  {
    id: 3,
    image: '/hero/kalldaja.png',
    title: 'Energji e Pastër Solare',
    description: 'Kurseni energji dhe mbroni mjedisin me sistemet tona solare',
    buttonText: 'Mëso më Shumë',
    buttonLink: '/produkte/kalldaja',
  },
  {
    id: 4,
    image: '/hero/pompa-termike.png',
    title: 'Energji e Pastër Solare',
    description: 'Kurseni energji dhe mbroni mjedisin me sistemet tona solare',
    buttonText: 'Mëso më Shumë',
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
