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
    buttonLink: '/categories/ngrohje-qendrore',
  },
  {
    id: 2,
    image: '/hero/klima.png',
    title: 'Klimatizim dhe Ventilim i Avancuar',
    description: 'Komfort optimal gjatë gjithë vitit me sistemet tona të klimatizimit',
    buttonText: 'Shiko Produktet',
    buttonLink: '/categories/klimatizim-ventilim',
  },
  {
    id: 3,
    image: '/hero/kalldaja.png',
    title: 'Energji e Pastër Solare',
    description: 'Kurseni energji dhe mbroni mjedisin me sistemet tona solare',
    buttonText: 'Mëso më Shumë',
    buttonLink: '/products/kalldaja-ecotek',
  },
  {
    id: 4,
    image: '/hero/pompa-termike.png',
    title: 'Energji e Pastër Solare',
    description: 'Kurseni energji dhe mbroni mjedisin me sistemet tona solare',
    buttonText: 'Mëso më Shumë',
    buttonLink: '/products/pompa-nxehtesie-ecotherm',
  },
  {
    id: 5,
    image: '/hero/servisim.jpg',
    title: 'Shërbime Profesionale të Instalimit',
    description: 'Ekipi ynë i kualifikuar siguron instalim dhe mirëmbajtje të përsosur',
    buttonText: 'Kontakto Tani',
    buttonLink: '/categories/servisim-instalim',
  },
];

// Category data structure
export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  heroImage: string;
  subcategories: Subcategory[];
}

// Subcategory data structure
export interface Subcategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  products: Product[];
}

// Product data structure
export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  price?: string;
  features: string[];
  details: {
    [key: string]: string;
  };
  specifications?: {
    [key: string]: string;
  };
  relatedProducts?: string[];
}

// Main categories data based on header navigation
export const categories: Category[] = [
  {
    id: "ngrohje-qendrore",
    title: "Ngrohje Qendrore",
    description: "Sisteme efikase dhe të qëndrueshme për ngrohje qëndrore në shtëpinë dhe biznesin tuaj",
    icon: "icons/heat-pump.svg",
    heroImage: "/hero/bojleri.png",
    subcategories: [
      {
        id: "pompa-termike",
        title: "Pompa Termike",
        description: "Ngrohje dhe ftohje efikase.",
        icon: "icons/heat-pump.svg",
        href: "/categories/ngrohje-qendrore?subcategory=pompa-termike",
        products: [
          {
            id: "pompa-nxehtesie-ecotherm",
            title: "Pompa Nxehtësie Inverter ECOTHERM Monoblock",
            description: "Efikasitet superior dhe performancë e lartë për ngrohje dhe ftohje. Teknologji Inverter për kursim maksimal të energjisë.",
            image: "/featured/pompa-termike.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Teknologji Inverter",
              "Efikasitet i lartë energjitik",
              "Operim i qetë",
              "Instalim i thjeshtë"
            ],
            details: {
              "Fuqia": "9kW",
              "COP": "4.5",
              "Tensioni": "230V",
              "Niveli i Zhurmës": "42dB",
              "Dimensionet": "1100 x 400 x 650 mm"
            }
          }
        ]
      },
      {
        id: "kalldaja-elektrike",
        title: "Kalldaja Elektrike",
        description: "Ngrohje e pastër dhe e thjeshtë.",
        icon: "icons/kalldaj.svg",
        href: "/categories/ngrohje-qendrore?subcategory=kalldaja-elektrike",
        products: [
          {
            id: "kalldaja-ecotek",
            title: "Kalldaja me Pelet ECOTEK",
            description: "Ngrohje efikase dhe ekologjike për shtëpinë tuaj. Teknologji e avancuar për djegie të plotë dhe kursim lëndë djegëse.",
            image: "/featured/kalldaja.png",
            category: "ngrohje-qendrore",
            subcategory: "kalldaja-elektrike",
            features: [
              "Ndezje automatike",
              "Pastrimi automatik",
              "Efikasitet i lartë",
              "Kontroll dixhital"
            ],
            details: {
              "Fuqia": "25kW",
              "Efikasiteti": "93%",
              "Kapaciteti i Rezervuarit": "60kg",
              "Konsumi i Peletit": "1.5-5.5 kg/h",
              "Dimensionet": "1200 x 600 x 1300 mm"
            }
          }
        ]
      },
      {
        id: "radiator",
        title: "Radiator",
        description: "Shpëndarje nxehtësie.",
        icon: "icons/radiator.svg",
        href: "/categories/ngrohje-qendrore?subcategory=radiator",
        products: []
      },
      {
        id: "fancoiler",
        title: "Fancoiler",
        description: "Ngrohje dhe ftohje e shpejtë.",
        icon: "icons/fancoiler.svg",
        href: "/categories/ngrohje-qendrore?subcategory=fancoiler",
        products: []
      }
    ]
  },
  {
    id: "klimatizim-ventilim",
    title: "Klimatizim & Ventilim",
    description: "Komfort optimal gjatë gjithë vitit me sistemet tona të klimatizimit dhe ventilimit",
    icon: "icons/hvac.svg",
    heroImage: "/hero/klima.png",
    subcategories: [
      {
        id: "kondicioner",
        title: "Kondicioner",
        description: "Freski optimale për ambientin tuaj.",
        icon: "icons/air-conditioner.svg",
        href: "/categories/klimatizim-ventilim?subcategory=kondicioner",
        products: [
          {
            id: "kondicioner-ecoklima",
            title: "Kondicioner Inverter ECOKLIMA",
            description: "Freski dhe ajër i pastër në shtëpinë tuaj. Dizajn modern, operim i qetë dhe teknologji Inverter për temperaturë ideale.",
            image: "/featured/klima.png",
            category: "klimatizim-ventilim",
            subcategory: "kondicioner",
            features: [
              "Teknologji Inverter",
              "Filtër antibakterial",
              "Wi-Fi i integruar",
              "Funksion i ngrohjes dhe ftohjes"
            ],
            details: {
              "Fuqia Ftohëse": "12000 BTU",
              "SEER": "7.1",
              "Tensioni": "230V",
              "Niveli i Zhurmës": "22dB",
              "Dimensionet": "900 x 300 x 200 mm"
            }
          }
        ]
      },
      {
        id: "pompa-termike",
        title: "Pompa Termike",
        description: "Zgjidhje e integruar ftohje.",
        icon: "icons/heat-pump.svg",
        href: "/categories/klimatizim-ventilim?subcategory=pompa-termike",
        products: []
      },
      {
        id: "fancoiler",
        title: "Fancoiler",
        description: "Ftohje dhe ngrohje e shpejtë.",
        icon: "icons/fancoiler.svg",
        href: "/categories/klimatizim-ventilim?subcategory=fancoiler",
        products: []
      },
      {
        id: "ventilim",
        title: "Sisteme Ventilimi",
        description: "Ajër i pastër dhe i freskët.",
        icon: "icons/hvac.svg",
        href: "/categories/klimatizim-ventilim?subcategory=ventilim",
        products: [
          {
            id: "ventilim-ecotek",
            title: "Sistem Ventilimi me Rikuperim Nxehtësie",
            description: "Ajër i pastër dhe i freskët me humbje minimale të nxehtësisë. Ideal për shtëpi dhe zyra me izolim të mirë.",
            image: "/images/products/ventilation/ventilation_main.jpg",
            category: "klimatizim-ventilim",
            subcategory: "ventilim",
            features: [
              "Rikuperim nxehtësie deri 90%",
              "Filtër HEPA",
              "Operim i qetë",
              "Kontroll i lagështisë"
            ],
            details: {
              "Kapaciteti": "350 m³/h",
              "Efikasiteti i Rikuperimit": "90%",
              "Konsumi": "45W",
              "Niveli i Zhurmës": "25dB",
              "Dimensionet": "600 x 300 x 200 mm"
            }
          }
        ]
      }
    ]
  },
  {
    id: "sanitari",
    title: "Sanitari",
    description: "Zgjidhje sanitare dhe higjienike për shtëpinë tuaj",
    icon: "icons/boiler.svg",
    heroImage: "/hero/bojleri.png",
    subcategories: [
      {
        id: "bojler",
        title: "Bojler",
        description: "Ujë i ngrohtë sanitar.",
        icon: "icons/boiler.svg",
        href: "/categories/sanitari?subcategory=bojler",
        products: [
          {
            id: "boiler-ecotherm",
            title: "Boileri Sanitari ECOTHERM",
            description: "Ujë i ngrohtë me efikasitet të lartë. Dizajn modern dhe teknologji e avancuar për kursim energjie dhe komfort.",
            image: "/featured/bojleri.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "Izolim i përmirësuar",
              "Rezistencë ndaj korrozionit",
              "Termostat dixhital",
              "Mbrojtje nga mbishkarkimi"
            ],
            details: {
              "Kapaciteti": "80L",
              "Fuqia": "2000W",
              "Tensioni": "230V",
              "Temperatura Maksimale": "75°C",
              "Dimensionet": "450 x 450 x 850 mm"
            }
          }
        ]
      },
      {
        id: "akumules",
        title: "Akumules",
        description: "Rezervuar uji.",
        icon: "icons/boiler.svg",
        href: "/categories/sanitari?subcategory=akumules",
        products: []
      }
    ]
  },
  {
    id: "servisim-instalim",
    title: "Servisim & Instalim",
    description: "Shërbime profesionale për instalimin dhe mirëmbajtjen e sistemeve",
    icon: "icons/service.svg",
    heroImage: "/hero/servisim.jpg",
    subcategories: [
      {
        id: "sherbime",
        title: "Shërbime Profesionale",
        description: "Instalim dhe mirëmbajtje.",
        icon: "icons/service.svg",
        href: "/categories/servisim-instalim?subcategory=sherbime",
        products: []
      }
    ]
  }
];

// Function to get a category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

// Function to get all products
export function getAllProducts(): Product[] {
  return categories.flatMap(category => 
    category.subcategories.flatMap(subcategory => subcategory.products)
  );
}

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find(product => product.id === id);
}

// Function to get products by category ID
export function getProductsByCategory(categoryId: string): Product[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  return category.subcategories.flatMap(subcategory => subcategory.products);
}

// Function to get products by subcategory
export function getProductsBySubcategory(categoryId: string, subcategoryId: string): Product[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  if (!subcategory) return [];
  
  return subcategory.products;
}
