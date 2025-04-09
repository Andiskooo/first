// Defines the structure for a product
export type Product = {
  id: string; // Unique identifier, used in the URL slug
  title: string;
  description: string;
  shortDescription?: string; // Optional short description for list views
  images: string[]; // URLs: first is main default
  category: string; // e.g., 'Panele Solare', 'Inverterë', 'Bateri'
  models?: { name: string; specs?: string }[]; // Optional models/variants
  details: { [key: string]: string }; // Technical specifications
};

// Array of mock product data
export const mockProducts: Product[] = [
  {
    id: 'panel-eko-550w',
    title: 'Paneli Solar Monokristalin EKO-550W',
    description: 'Performancë e lartë dhe efikasitet i shkëlqyer edhe në kushte me dritë të ulët. Ideal për instalime rezidenciale dhe komerciale. Teknologji PERC për kapje më të mirë të dritës.',
    shortDescription: 'Panel monokristalin 550W me efikasitet të lartë.',
    images: [
      '/images/products/panels/panel_mono_main.jpg', // Placeholder
      '/images/products/panels/panel_mono_thumb1.jpg',
      '/images/products/panels/panel_mono_thumb2.jpg',
      '/images/products/panels/panel_mono_dims.jpg',
    ],
    category: 'Panele Solare',
    models: [
      { name: '550W' },
      { name: '545W' },
      { name: '540W' },
    ],
    details: {
      'Prodhuesi': 'ECOTEK Solar',
      'Modeli': 'EKO-MONO-550W',
      'Tipi i Qelizave': 'Monokristalin PERC',
      'Numri i Qelizave': '144 (6x24)',
      'Efikasiteti': 'Deri në 21.3%',
      'Fuqia Maksimale (Pmax)': '550 W',
      'Tensioni në Pmax (Vmp)': '41.96 V',
      'Rryma në Pmax (Imp)': '13.11 A',
      'Tensioni i Qarkut të Hapur (Voc)': '49.90 V',
      'Rryma e Qarkut të Shkurtër (Isc)': '13.87 A',
      'Temperatura Operative': '-40°C deri +85°C',
      'Tensioni Maksimal i Sistemit': '1500V DC',
      'Dimensionet': '2279 x 1134 x 35 mm',
      'Pesha': '28.6 kg',
      'Kutia e Lidhjes': 'IP68',
      'Garancia e Produktit': '12 Vjet',
      'Garancia e Performancës Lineare': '25 Vjet (84.8% e fuqisë nominale)',
    }
  },
  {
    id: 'inverter-hibrid-5kw',
    title: 'Inverter Hibrid ECOTEK HYB-5K',
    description: 'Zgjidhje fleksibël për menaxhimin e energjisë solare dhe ruajtjen në bateri. Monitorim inteligjent përmes Wi-Fi dhe dizajn kompakt për instalim të lehtë.',
    shortDescription: 'Inverter hibrid 5kW, ideal për rezidenca.',
    images: [
        '/images/products/inverters/inverter_hybrid_main.jpg', // Placeholder
        '/images/products/inverters/inverter_hybrid_ports.jpg',
        '/images/products/inverters/inverter_hybrid_app.jpg',
    ],
    category: 'Inverterë',
    models: [
        { name: '5kW' },
        { name: '8kW' }, // Example of another model
    ],
    details: {
        'Prodhuesi': 'ECOTEK Power',
        'Modeli': 'EKO-HYB-5K',
        'Tipi': 'Hibrid (On-Grid/Off-Grid)',
        'Faza': 'Njëfazor',
        'Fuqia Nominale AC Output': '5000 W',
        'Fuqia Maksimale AC Output': '5500 VA',
        'Tensioni Nominal AC': '230 V',
        'Fuqia Maksimale PV Input': '6500 W',
        'Tensioni Maksimal DC (PV)': '500 V',
        'MPPT Rang': '120-450 V',
        'Numri i MPPT': '2',
        'Rryma Maks. PV Input': '13 A / 13 A',
        'Tipi i Baterisë': 'Litium-ion / Plumb-acid',
        'Tensioni Nominal i Baterisë': '48 V',
        'Rryma Maks. e Karikimit/Shkarkimit': '100 A',
        'Efikasiteti Maksimal': '97.6%',
        'Efikasiteti Euro': '97.0%',
        'Ndërfaqja e Komunikimit': 'Wi-Fi (standard), RS485, CAN',
        'Grada e Mbrojtjes': 'IP65',
        'Dimensionet (GjxLxTh)': '450 x 550 x 200 mm',
        'Pesha': '25 kg',
        'Garancia': '5 Vjet (Zgjatje opsionale)',
    }
  },
  {
    id: 'bateri-lifepo4-10kwh',
    title: 'Bateri Litium ECOTEK LiFePO4 10kWh',
    description: 'Bateri me kapacitet të lartë dhe jetëgjatësi të shkëlqyer, bazuar në teknologjinë LiFePO4 për siguri maksimale. Ideale për sisteme hibride dhe off-grid.',
    shortDescription: 'Bateri LiFePO4 10kWh, 48V, e sigurt dhe jetëgjatë.',
    images: [
        '/images/products/batteries/battery_lifepo4_main.jpg', // Placeholder
        '/images/products/batteries/battery_stackable.jpg',
        '/images/products/batteries/battery_bms.jpg',
    ],
    category: 'Bateri',
    details: {
        'Prodhuesi': 'ECOTEK Energy Storage',
        'Modeli': 'EKO-LFP-10KWH',
        'Kapaciteti Nominal': '10.24 kWh',
        'Energjia e Përdorshme': '9.2 kWh (90% DoD)',
        'Tensioni Nominal': '51.2 V',
        'Rangu i Tensionit': '44.8 - 57.6 V',
        'Kimia e Qelizave': 'LiFePO4 (Litium Hekur Fosfat)',
        'Rryma Nominale e Karikimit/Shkarkimit': '100 A',
        'Rryma Maksimale e Karikimit/Shkarkimit': '150 A (peak 5 sekonda)',
        'Cikli i Jetës': '> 6000 cikle @ 80% DoD, 25°C',
        'Komunikimi': 'CAN, RS485',
        'Paralelizimi': 'Deri në 16 njësi',
        'Temperatura e Operimit (Karikim)': '0°C deri +50°C',
        'Temperatura e Operimit (Shkarkim)': '-10°C deri +55°C',
        'Grada e Mbrojtjes': 'IP54 (për instalim të brendshëm)',
        'Dimensionet': '600 x 480 x 220 mm',
        'Pesha': '95 kg',
        'Certifikimet': 'CE, UN38.3, IEC62619',
        'Garancia': '10 Vjet',
    }
  },
  // Add more mock products as needed
];

// Function to find a product by its ID from the mock data
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Function to get all products (useful for the main products page)
export const getAllProducts = (): Product[] => {
  return mockProducts;
};

// Function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};
