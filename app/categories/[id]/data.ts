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
  image: string;
  category: string;
  subcategory: string;
  price?: string;
  features: string[];
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
    heroImage: "/hero/Radiatori.jpg",
    subcategories: [
      {
        id: "pompa-termike",
        title: "Pompa Termike",
        description: "Pompe termike për ngrohje dhe ftohje në shtëpinë tuaj",
        icon: "icons/heat-pump.svg",
        href: "/categories/ngrohje-qendrore?subcategory=pompa-termike",
        products: [
          {
            id: "pompa-nxehtesie-vanguard",
            title: "Pompa Termike Vanguard Comfort",
            image: "/produktet/Vanguard.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A++",
              "R32 Refrigerant, Inverter Technology",
              "Higher water temperature 55 C",
              "Capacities 12kW - 32 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-serene",
            title: "Pompa Termike Serene Climate",
            image: "/produktet/Serene.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R32 Refrigerant, Inverter Technology",
              "Higher water temperature 55 C",
              "Integrated Circulation Pump, Expansion Tank, Valves",
              "Capacities 15kW - 24 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-apex",
            title: "Pompa Termike Apex Heating",
            image: "/produktet/Apex.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R290 Refrigerant, Inverter Technology",
              "Higher water temperature 75 C",
              "Integrated Circulation Pump, Expansion Tank, Valves",
              "Capacities 15kW - 32 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-maxi",
            title: "Pompa Termike Maxi Afariste",
            image: "/produktet/Maxi.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A++",
              "R410A Refrigerant",
              "Inverter Technology",
              "Higher water temperature 55 C",
              "Capacities 45kW - 350 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-sinceko",
            title: "Pompa Termike Gjeotermike Sinceko",
            image: "/produktet/Sinceko.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R410A Refrigerant",
              "Inverter Technology",
              "Higher water temperature 60 C",
              "Capacities 12kW - 55 kW"
            ],
          },
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
            id: "kalldaja-og",
            title: "Kalldaja Elektrike ECOTEK OG",
            image: "/produktet/OG.png",
            category: "ngrohje-qendrore",
            subcategory: "kalldaja-elektrike",
            features: [
              "Efficient Electric Heating",
              "Water Pressure Protection",
              "Digital Display, Wi-Fi connection",
              "Higher Water Temp 90 C",
              "Capacities 6kW - 27kW"
            ]
          },
          {
            id: "kalldaja-mp",
            title: "Kalldaja Elektrike ECOTEK MP",
            image: "/produktet/MP.png",
            category: "ngrohje-qendrore",
            subcategory: "kalldaja-elektrike",
            features: [
              "Efficient Electric Heating",
              "Water Pressure Protection",
              "Digital Display, Wi-Fi connection",
              "Higher Water Temp 90 C",
              "Capacities 6kW - 27kW"
            ]
          },
          {
            id: "kalldaja-jp",
            title: "Kalldaja Elektrike ECOTEK JP",
            image: "/produktet/JP.png",
            category: "ngrohje-qendrore",
            subcategory: "kalldaja-elektrike",
            features: [
              "Efficient Electric Heating",
              "Water Pressure Protection",
              "Digital Display, Wi-Fi connection",
              "Higher Water Temp 90 C",
              "Capacities 6kW - 27kW"
            ]
          }
        ]
      },
      {
        id: "radiator",
        title: "Radiator",
        description: "Ngrohje e vazhdueshme.",
        icon: "icons/radiator.svg",
        href: "/categories/ngrohje-qendrore?subcategory=radiator",
        products: [
          {
            id: "radiator",
            title: "Radiator Panel",
            image: "/produktet/Radiatori.png",
            category: "ngrohje-qendrore",
            subcategory: "radiator",
            features: [
              "Ngrohje e Shpejtë dhe e Barabartë",
              "Materiale të Cilësisë së Lartë",
              "Efiçiencë e Lartë Energjitike",
              "Dizajn Modern dhe Elegant",

            ]
          },
          {
            id: "radiator-gypor",
            title: "Radiator Gypor",
            image: "/produktet/RadiatorGyp.png",
            category: "ngrohje-qendrore",
            subcategory: "radiator",
            features: [
              "Ngrohje e Shpejtë dhe e Barabartë",
              "Materiale të Cilësisë së Lartë",
              "Efiçiencë e Lartë Energjitike",
              "Dizajn Modern dhe Elegant",

            ]
          }
        ]
      },
      {
        id: "fancoiler",
        title: "Fancoiler",
        description: "Ngrohje dhe ftohje e shpejtë.",
        icon: "icons/fancoiler.svg",
        href: "/categories/ngrohje-qendrore?subcategory=fancoiler",
        products: [
          {
            id: "fancoiler",
            title: "Fancoiler ECOTEK",
            image: "/produktet/fancoilera.png",
            category: "ngrohje-qendrore",
            subcategory: "fancoiler",
            features: [
             "Efiçiencë Energjitike",
              "Materiale të Cilësisë së Lartë",
              "Funksionim i Heshtur",
              "Kontroll i Saktë i Temperaturës",
              "Capacities 3kW - 6 kW"
            ]
          },
          {
            id: "fancoiler-kasetor",
            title: "Fancoiler Kasetor",
            image: "/produktet/Kasetor.png",
            category: "ngrohje-qendrore",
            subcategory: "fancoiler",
            features: [
              "Efiçiencë Energjitike",
              "Materiale të Cilësisë së Lartë",
              "Funksionim i Heshtur",
              "Kontroll i Saktë i Temperaturës",
              "Capacities 3kW - 12 kW"
            ]
          }
        ]
      },
      {
        id: "akumulues",
        title: "Akumulues",
        description: "Rezervuar uji.",
        icon: "icons/boiler.svg",
        href: "/categories/ngrohje-qendrore?subcategory=akumulues",
        products: [
          {
            id: "akumulues-60l",
            title: "Akumulues ECOTEK",
            image: "/produktet/buffer60.png",
            category: "ngrohje-qendrore",
            subcategory: "akumulues",
            features: [
              "60 L",
              "3000 Watt/hr Shpenzime",            
            ]
          },
          {
            id: "akumulues-100l",
            title: "Akumulues ECOTEK",
            image: "/produktet/buffer100.png",
            category: "ngrohje-qendrore",
            subcategory: "akumulues",
            features: [
              "100 L",
              "3000 Watt/hr Shpenzime",            
            ]
          },
          {
            id: "akumulues-200l",
            title: "Akumulues ECOTEK",
            image: "/produktet/bufferi200.png",
            category: "ngrohje-qendrore",
            subcategory: "akumulues",
            features: [
              "200 L",
              "3000 Watt/hr Shpenzime",            
            ]
          }
        ]
      }
    ]
  },
  {
    id: "klimatizim-ventilim",
    title: "Klimatizim & Ventilim",
    description: "Komfort optimal gjatë gjithë vitit me sistemet tona të klimatizimit dhe ventilimit",
    icon: "icons/hvac.svg",
    heroImage: "/produktet/HVAC.png",
    subcategories: [
      {
        id: "kondicioner",
        title: "Kondicioner",
        description: "Freski optimale për ambientin tuaj.",
        icon: "icons/air-conditioner.svg",
        href: "/categories/klimatizim-ventilim?subcategory=kondicioner",
        products: [
          {
            id: "kondicioner-aria",
            title: "Candy - Aria Series",
            image: "/produktet/aria.png",
            category: "klimatizim-ventilim",
            subcategory: "kondicioner",
            features: [
              "Efficiency A+++/A+++",
              "Wi-Fi, HoN app",
              "Capacities",
              "12,000 BTU, 18,000 BTU,"
            ]
          },
          {
            id: "kondicioner-pura",
            title: "Candy - Pura Series",
            image: "/produktet/pura.png",
            category: "klimatizim-ventilim",
            subcategory: "kondicioner",
            features: [
              "Efficiency A+++/A++",
              "Wi-Fi, HoN app",
              "Capacities",
              "9,000 BTU, 12,000 BTU, 18,000 BTU, 24,000 BTU"
            ]
          }

        ]
      },
      {
        id: "fancoiler",
        title: "Fancoiler",
        description: "Ftohje dhe ngrohje e shpejtë.",
        icon: "icons/fancoiler.svg",
        href: "/categories/klimatizim-ventilim?subcategory=fancoiler",
        products: [
          {
            id: "fancoiler",
            title: "Fancoiler ECOTEK",
            image: "/produktet/fancoilera.png",
            category: "ngrohje-qendrore",
            subcategory: "fancoiler",
            features: [
             "Efiçiencë Energjitike",
              "Materiale të Cilësisë së Lartë",
              "Funksionim i Heshtur",
              "Kontroll i Saktë i Temperaturës",
              "Capacities 3kW - 6 kW"
            ]
          },
          {
            id: "fancoiler-kasetor",
            title: "Fancoiler Kasetor",
            image: "/produktet/Kasetor.png",
            category: "ngrohje-qendrore",
            subcategory: "fancoiler",
            features: [
              "Efiçiencë Energjitike",
              "Materiale të Cilësisë së Lartë",
              "Funksionim i Heshtur",
              "Kontroll i Saktë i Temperaturës",
              "Capacities 3kW - 12 kW"
            ]
          }
        ]
        
      },
      {
        id: "pompa-termike",
        title: "Pompa Termike",
        description: "Zgjidhje e integruar ftohje.",
        icon: "icons/heat-pump.svg",
        href: "/categories/klimatizim-ventilim?subcategory=pompa-termike",
        products: [
          {
            id: "pompa-nxehtesie-vanguard",
            title: "Pompa Termike Vanguard Comfort",
            image: "/produktet/Vanguard.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A++",
              "R32 Refrigerant, Inverter Technology",
              "Higher water temperature 55 C",
              "Capacities 12kW - 32 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-serene",
            title: "Pompa Termike Serene Climate",
            image: "/produktet/Serene.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R32 Refrigerant, Inverter Technology",
              "Higher water temperature 55 C",
              "Integrated Circulation Pump, Expansion Tank, Valves",
              "Capacities 15kW - 24 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-apex",
            title: "Pompa Termike Apex Heating",
            image: "/produktet/Apex.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R290 Refrigerant, Inverter Technology",
              "Higher water temperature 75 C",
              "Integrated Circulation Pump, Expansion Tank, Valves",
              "Capacities 15kW - 32 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-maxi",
            title: "Pompa Termike Maxi Afariste",
            image: "/produktet/Maxi.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A++",
              "R410A Refrigerant",
              "Inverter Technology",
              "Higher water temperature 55 C",
              "Capacities 45kW - 350 kW"
            ],
          },
          {
            id: "pompa-nxehtesie-sinceko",
            title: "Pompa Termike Gjeotermike Sinceko",
            image: "/produktet/Sinceko.png",
            category: "ngrohje-qendrore",
            subcategory: "pompa-termike",
            features: [
              "Energy Efficiency Class A+++",
              "R410A Refrigerant",
              "Inverter Technology",
              "Higher water temperature 60 C",
              "Capacities 12kW - 55 kW"
            ],
          },
        ]
      },
    ]
  },
  {
    id: "sanitari",
    title: "Sanitari",
    description: "Zgjidhje sanitare dhe higjienike për shtëpinë tuaj",
    icon: "icons/boiler.svg",
    heroImage: "/hero/Tushi.png",
    subcategories: [
      {
        id: "bojler",
        title: "Boilera",
        description: "Ujë i ngrohtë sanitar.",
        icon: "icons/boiler.svg",
        href: "/categories/sanitari?subcategory=bojler",
        products: [
          {
            id: "boiler-ecopump-200l",
            title: "Boileri ECOPUMP",
            image: "/produktet/boilerieco.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "Pompë Termike e Integruar",
              "600 Watt/hr Shpenzime",
              "Termostat dixhital",
              "R134a / R290 Refrigerant",
              "Temperatura e ujit 75 C",
              "Kapacitetet 200 L",
            ]
          },
          {
            id: "boiler-ecopump-300l",
            title: "Boileri ECOPUMP",
            image: "/produktet/boilerieco.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "Pompë Termike e Integruar",
              "600 Watt/hr Shpenzime",
              "Termostat dixhital",
              "R134a / R290 Refrigerant",
              "Temperatura e ujit 75 C",
              "Kapacitetet 300 L",
            ]
          },
          {
            id: "boiler-electric",
            title: "Boiler Electric",
            image: "/produktet/Boileri300.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "3000 Watt/hr Shpenzime",
              "Integrim Nxemjes Qendrore",
              "Temperatura e ujit 75 C",
              "Kapacitetet 300 L",
            ]
          },
          {
            id: "boiler-electric-200l",
            title: "Boiler Electric",
            image: "/produktet/Boileri200.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "3000 Watt/hr Shpenzime",
              "Integrim Nxemjes Qendrore",
              "Temperatura e ujit 75 C",
              "Kapacitetet 200 L",
            ]
          },
          {
            id: "boiler-electric-150l",
            title: "Boiler Electric",
            image: "/produktet/Boileri150L.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "3000 Watt/hr Shpenzime",
              "Integrim Nxemjes Qendrore",
              "Temperatura e ujit 75 C",
              "Kapacitetet 150 L",
            ]
          },
          {
            id: "boiler-electric-80l",
            title: "Boiler Electric Tesy",
            image: "/produktet/Boileri80.png",
            category: "sanitari",
            subcategory: "bojler",
            features: [
              "3000 Watt/hr Shpenzime",
              "Integrim Nxemjes Qendrore",
              "Temperatura e ujit 75 C",
              "Kapacitetet 80 L",
            ]
          },
        ]
      },
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
