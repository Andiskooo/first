// Define the extended product interface with all the properties needed for the enhanced product page
export interface Badge {
  text: string;
  bgColor?: string;
  textColor?: string;
}

export interface KeyCharacteristic {
  name: string;
  value: string;
  icon?: string;
}

export interface ProductModel {
  id: string;
  name: string;
  price?: string;
}

export interface Download {
  title: string;
  description: string;
  url: string;
  fileSize?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
  category: string;
  subcategory?: string;
  badges?: Badge[];
  keyCharacteristics?: KeyCharacteristic[];
  models?: ProductModel[];
  features: string[];
  longDescription?: string;
  details?: Record<string, string>;
  specifications?: Record<string, Record<string, string>>;
  downloads?: Download[];
  relatedProducts?: string[];
}

// Get product by ID
export function getProductById(id: string): Product | null {
  // Simulate fetching from a database
  const allProducts = getAllProducts();
  return allProducts.find(product => product.id === id) || null;
}

// Get all products
export function getAllProducts(): Product[] {
  // In a real app, this would fetch from a database
  // For now, we'll return a static list of products
  return [
    // Pompat Termike
    {
      id: 'pompa-nxehtesie-vanguard',
      title: 'Pompa Termike Vanguard Comfort',
      description: 'Pompë termike ajër-ujë me efikasitet të lartë për ngrohje dhe ujë të ngrohtë sanitar.',
      price: 'Kontakto',
      image: '/produktet/pompa-termike-vanguard.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A++ Eficencë',
          bgColor: '#e7f9ed',
          textColor: '#18a757'
        },
        {
          text: 'R32 Ftohës',
          bgColor: '#e5f6fd',
          textColor: '#0284c7'
        },
        {
          text: 'Teknologji Inverter',
          bgColor: '#fef3c7',
          textColor: '#b45309'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Fuqia',
          value: '12kW - 32kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Efikasiteti',
          value: 'A++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Garancia',
          value: '3 vite',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Temp. Ujit',
          value: '55°C',
          icon: '/icons/temperature.svg'
        }
      ],
      models: [
        {
          id: 'vanguard-12',
          name: 'Vanguard-12kW',
          price: '2430'
        },
        {
          id: 'vanguard-18',
          name: 'Vanguard-18kW',
          price: 'Kontakto'
        },
        {
          id: 'vanguard-24',
          name: 'Vanguard-24kW',
          price: 'Kontakto'
        },
        {
          id: 'vanguard-32',
          name: 'Vanguard-32kW',
          price: 'Kontakto'
        }
      ],
      features: [
        'Energy Efficiency Class A++',
        'R32 Refrigerant - Më ekologjik dhe efikas',
        'Inverter Technology - Për kursim energjie dhe operim të qetë',
        'Temperaturë e lartë uji deri në 55°C',
        'Disponueshme në kapacitete 12kW, 18kW, 24kW, 32kW',
        'Kontroll i avancuar dixhital',
        'Dizajn kompakt dhe i lehtë për instalim'
      ],
      longDescription: `
        <p>Pompa termike Vanguard Comfort është zgjidhja ideale për ngrohjen efikase dhe prodhimin e ujit të ngrohtë sanitar në shtëpinë tuaj. Me teknologjinë Inverter dhe ftohësin ekologjik R32, ajo ofron performancë të lartë me konsum të ulët energjie.</p>
        
        <p>Klasifikimi i lartë i efikasitetit A++ siguron kursime të ndjeshme në faturat tuaja të energjisë. Vanguard Comfort është projektuar për të ofruar komfort maksimal termik edhe në ditët më të ftohta.</p>
        
        <p>Me një gamë të gjerë kapacitetesh nga 12kW deri në 32kW, mund të zgjidhni modelin e duhur për nevojat specifike të hapësirës tuaj.</p>
      `,
      specifications: {
        // Data structured as: Characteristic -> Model -> Value
        'Model No.': {
          'vanguard-12': 'BLN-012TA1',
          'vanguard-18': 'BLN-018TA1',
          'vanguard-24': 'BLN-024TA1',
          'vanguard-32': 'BLN-031TA1'
        },
        'Power supply': {
          'vanguard-12': '220V-240V/1/50Hz',
          'vanguard-18': '220V-240V/1/50Hz',
          'vanguard-24': '380V/1/50Hz',
          'vanguard-32': '380V/1/50Hz'
        },
        'Heating @ A7/W35 Capacity (kW)': {
          'vanguard-12': '12 (3.2-12.8)',
          'vanguard-18': '18 (5.2-20.5)',
          'vanguard-24': '24 (5-24.5)',
          'vanguard-32': '31 (6-31.5)'
        },
        'Heating @ A7/W35 Power Input (kW)': {
          'vanguard-12': '2.6',
          'vanguard-18': '3.81',
          'vanguard-24': '5.42 (1.5-5.57)',
          'vanguard-32': '7.38 (2.5-7.5)'
        },
        'Heating @ A7/W35 COP': {
          'vanguard-12': '4.62',
          'vanguard-18': '4.72',
          'vanguard-24': '4.42',
          'vanguard-32': '4.2'
        },
        'Heating @ A7/W55 Capacity (kW)': {
          'vanguard-12': '10 (3.1-10.9)',
          'vanguard-18': '15 (4.6-18.5)',
          'vanguard-24': '26 (5-26.5)',
          'vanguard-32': '29 (6-29.5)'
        },
        'Heating @ A7/W55 Power Input (kW)': {
          'vanguard-12': '2.82',
          'vanguard-18': '4.08',
          'vanguard-24': '8.81 (2.2-8.86)',
          'vanguard-32': '10.3 (2.8-10.5)'
        },
        'Heating @ A7/W55 COP': {
          'vanguard-12': '3.54',
          'vanguard-18': '3.68',
          'vanguard-24': '2.95',
          'vanguard-32': '2.81'
        },
        'Cooling @ A35/W7 Capacity (kW)': {
          'vanguard-12': '8 (2.6-9.1)',
          'vanguard-18': '14 (4.2-16.8)',
          'vanguard-24': '18 (5-18.5)',
          'vanguard-32': '22.5 (6-23)'
        },
        'Cooling @ A35/W7 Power Input (kW)': {
          'vanguard-12': '2.25',
          'vanguard-18': '3.87',
          'vanguard-24': '6.1 (2.1-6.25)',
          'vanguard-32': '8.65 (2.6-9.02)'
        },
        'Cooling @ A35/W7 EER': {
          'vanguard-12': '3.56',
          'vanguard-18': '3.62',
          'vanguard-24': '2.95',
          'vanguard-32': '2.6'
        },
        'Max Power Input (kW)': {
          'vanguard-12': '5.3',
          'vanguard-18': '6.8',
          'vanguard-24': '11.5',
          'vanguard-32': '12.8'
        },
        'Max Current (A)': {
          'vanguard-12': '22',
          'vanguard-18': '32',
          'vanguard-24': '20',
          'vanguard-32': '26'
        },
        'Refrigerant': {
          'vanguard-12': 'R410a', // NOTE: Differs from description (R32)
          'vanguard-18': 'R410a',
          'vanguard-24': 'R410a',
          'vanguard-32': 'R410a'
        },
        'Net Weight (kg)': {
          'vanguard-12': '75',
          'vanguard-18': '147',
          'vanguard-24': '160',
          'vanguard-32': '200'
        },
        'Dimensions (L*W*H) (mm)': {
          'vanguard-12': '1005*375*800',
          'vanguard-18': '1077*377*1460',
          'vanguard-24': '1127*427*1560',
          'vanguard-32': '1127*427*1560'
        },
        'Package Dimensions (L*W*H) (mm)': {
          'vanguard-12': '1080*455*955',
          'vanguard-18': '1150*460*1520',
          'vanguard-24': '1200*500*1620',
          'vanguard-32': '1200*500*1620'
        },
        'Compressor': {
          'vanguard-12': 'GMCC',
          'vanguard-18': 'Panasonic',
          'vanguard-24': 'Panasonic',
          'vanguard-32': 'Panasonic'
        },
        'Heat exchanger type': {
          'vanguard-12': 'Plate heat exchanger',
          'vanguard-18': 'Plate heat exchanger',
          'vanguard-24': 'Plate heat exchanger',
          'vanguard-32': 'Plate heat exchanger'
        }
      },
      downloads: [
        {
          title: 'Manuali i përdorimit',
          description: 'Udhëzues për përdorimin e Vanguard Comfort (PDF)',
          url: '/downloads/vanguard-manual.pdf',
          fileSize: '7 MB'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-apex', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-serene',
      title: 'Pompa Termike Serene Climate',
      description: 'Pompë termike ajër-ujë A+++ me teknologji Inverter dhe ftohës R32.',
      price: 'Kontakto',
      image: '/produktet/pompa-termike-serene.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A+++ Efiçencë',
          bgColor: '#e7f9ed',
          textColor: '#18a757'
        },
        {
          text: 'R32 Ftohës',
          bgColor: '#e5f6fd',
          textColor: '#0284c7'
        },
        {
          text: 'Inverter',
          bgColor: '#fef3c7',
          textColor: '#b45309'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A+++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '15kW - 24kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 55°C',
          icon: '/icons/temperature.svg'
        },
        {
          name: 'Ftohësi',
          value: 'R32',
          icon: '/icons/refrigerant.svg'
        }
      ],
      models: [
        {
          id: 'serene-10kw',
          name: 'Serene Climate 10kW',
          price: 'Kontakto'
        },
        {
          id: 'serene-15kw',
          name: 'Serene Climate 15kW',
          price: 'Kontakto'
        },
        {
          id: 'serene-18kw',
          name: 'Serene Climate 18kW',
          price: 'Kontakto'
        },
        {
          id: 'serene-24kw',
          name: 'Serene Climate 24kW',
          price: 'Kontakto'
        }
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A+++',
        'Ftohës ekologjik R32',
        'Teknologji Inverter për modulim të vazhdueshëm',
        'Temperaturë maksimale e ujit 55°C',
        'Pompë qarkullimi e integruar',
        'Enë ekspansioni e integruar',
        'Valvula sigurie të integruara',
        'Operim i qetë',
        'Kontroll inteligjent',
        'Kapacitete: 15kW, 18kW, 24kW'
      ],
      longDescription: `
        <p>Pompa termike Serene Climate kombinon efikasitetin e lartë A+++ me teknologjinë moderne Inverter dhe ftohësin ekologjik R32. Kjo pompë ajër-ujë është projektuar për të ofruar ngrohje të besueshme dhe ekonomike.</p>
        
        <p>Me komponentë të integruar si pompa e qarkullimit, ena e ekspansionit dhe valvulat, instalimi thjeshtohet ndjeshëm. Ajo mund të arrijë një temperaturë uji deri në 55°C, duke e bërë të përshtatshme për sisteme ngrohjeje me radiatorë ose dysheme.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R32',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '2-5 vite (Shembull - Specify)'
      },
      specifications: {
        'Model No.': {
          'serene-10kw': 'BLN-010TB1',
          'serene-15kw': 'BLN-014TB1',
          'serene-18kw': 'BLN-018TB1',
          'serene-24kw': 'BLN-024TB3'
        },
        'Power supply (V/Ph/Hz)': {
          'serene-10kw': '220~240/1/50',
          'serene-15kw': '220~240/1/50',
          'serene-18kw': '380~415/3/50',
          'serene-24kw': '380~415/3/50'
        },
        'Heating Capacity (A7/6°C,W30/35°C) (kW)': {
          'serene-10kw': '4.20 - 12.20',
          'serene-15kw': '5.30 - 16.50',
          'serene-18kw': '6.20 - 20.50',
          'serene-24kw': '6.50 - 26.10'
        },
        'Heating Power Input (A7/6°C,W30/35°C) (kW)': {
          'serene-10kw': '0.86 - 2.88',
          'serene-15kw': '1.15 - 4.15',
          'serene-18kw': '1.36 - 5.28',
          'serene-24kw': '1.78 - 6.45'
        },
        'Heating Current Input (A7/6°C,W30/35°C) (A)': {
          'serene-10kw': '3.82 - 12.77',
          'serene-15kw': '5.10 - 18.41',
          'serene-18kw': '2.31 - 8.96',
          'serene-24kw': '2.87 - 10.35'
        },
        'Heating COP (A7/6°C,W30/35°C) (W/W)': {
          'serene-10kw': '4.23 - 5.39',
          'serene-15kw': '3.97 - 5.43',
          'serene-18kw': '3.88 - 5.21',
          'serene-24kw': '4.04 - 5.43'
        },
        'Heating Capacity (A7/6°C,W47/55°C) (kW)': {
          'serene-10kw': '3.85 - 11.20',
          'serene-15kw': '4.90 - 15.10',
          'serene-18kw': '6.30 - 19.90',
          'serene-24kw': '6.90 - 26.10'
        },
        'Heating Power Input (A7/6°C,W47/55°C) (kW)': {
          'serene-10kw': '1.13 - 3.75',
          'serene-15kw': '1.65 - 5.25',
          'serene-18kw': '1.65 - 6.82',
          'serene-24kw': '1.95 - 8.55'
        },
        'Heating Current Input (A7/6°C,W47/55°C) (A)': {
          'serene-10kw': '5.01 - 16.6',
          'serene-15kw': '7.32 - 23.30',
          'serene-18kw': '2.80 - 11.58',
          'serene-24kw': '3.15 - 13.80'
        },
        'Heating COP (A7/6°C,W47/55°C) (W/W)': {
          'serene-10kw': '2.99 - 3.46',
          'serene-15kw': '2.87 - 3.38',
          'serene-18kw': '2.91 - 3.34',
          'serene-24kw': '3.05 - 3.42'
        },
        'Cooling Capacity (A35/24°C,W12/7°C) (kW)': {
          'serene-10kw': '2.60 - 10.30',
          'serene-15kw': '4.50 - 13.50',
          'serene-18kw': '5.50 - 17.50',
          'serene-24kw': '5.20 - 21.30'
        },
        'Cooling Power Input (A35/24°C,W12/7°C) (kW)': {
          'serene-10kw': '0.91 - 3.65',
          'serene-15kw': '1.45 - 4.85',
          'serene-18kw': '1.65 - 6.25',
          'serene-24kw': '1.95 - 8.20'
        },
        'Cooling Current Input (A35/24°C,W12/7°C) (A)': {
          'serene-10kw': '4.03 - 16.19',
          'serene-15kw': '6.43 - 21.52',
          'serene-18kw': '2.80 - 10.61',
          'serene-24kw': '3.15 - 13.23'
        },
        'Cooling EER (A35/24°C,W12/7°C) (W/W)': {
          'serene-10kw': '3.00',
          'serene-15kw': '2.87',
          'serene-18kw': '2.96',
          'serene-24kw': '2.92'
        },
        'ERP Level (Outlet water temp. at 35°C)': {
          'serene-10kw': 'A+++',
          'serene-15kw': 'A+++',
          'serene-18kw': 'A+++',
          'serene-24kw': 'A+++'
        },
        'ERP Level (Outlet water temp. at 55°C)': {
          'serene-10kw': 'A++',
          'serene-15kw': 'A++',
          'serene-18kw': 'A++',
          'serene-24kw': 'A++'
        },
        'Rated input power (kW)': {
          'serene-10kw': '3.83',
          'serene-15kw': '6.20',
          'serene-18kw': '7.50',
          'serene-24kw': '10.00'
        },
        'Rated input current (A)': {
          'serene-10kw': '17',
          'serene-15kw': '27.50',
          'serene-18kw': '35.00',
          'serene-24kw': '17.00'
        },
        'Refrigerant Type / Charge / GWP (... / kg)': {
          'serene-10kw': 'R32/1.8/675',
          'serene-15kw': 'R32/2.8/675',
          'serene-18kw': 'R32/3.5/675',
          'serene-24kw': 'R32/3.5/675'
        },
        'Rated water flow (m3/h)': {
          'serene-10kw': '1.75',
          'serene-15kw': '2.52',
          'serene-18kw': '3.20',
          'serene-24kw': '4.12'
        },
        'Fan quantity': {
          'serene-10kw': '1',
          'serene-15kw': '1',
          'serene-18kw': '2',
          'serene-24kw': '2'
        },
        'Fan motor type': {
          'serene-10kw': 'DC inverter',
          'serene-15kw': 'DC inverter',
          'serene-18kw': 'DC inverter',
          'serene-24kw': 'DC inverter'
        },
        'Compressor': {
          'serene-10kw': 'Panasonic / DC inverter / Rotary / EVI',
          'serene-15kw': 'Panasonic / DC inverter / Rotary / EVI',
          'serene-18kw': 'Panasonic / DC inverter / Rotary / EVI',
          'serene-24kw': 'Panasonic / DC inverter / Rotary / EVI'
        },
        'Circulating pump': {
          'serene-10kw': 'Inverter type / Built-in',
          'serene-15kw': 'Inverter type / Built-in',
          'serene-18kw': 'Inverter type / Built-in',
          'serene-24kw': 'Inverter type / Built-in'
        },
        'IP Class': {
          'serene-10kw': 'IPX4',
          'serene-15kw': 'IPX4',
          'serene-18kw': 'IPX4',
          'serene-24kw': 'IPX4'
        },
        'Sound pressure at 1m distance (dB(A))': {
          'serene-10kw': '52',
          'serene-15kw': '53',
          'serene-18kw': '56',
          'serene-24kw': '58'
        },
        'Max outlet water temperature (°C)': {
          'serene-10kw': '60',
          'serene-15kw': '60',
          'serene-18kw': '60',
          'serene-24kw': '60'
        },
        'Water piping connections (inch)': {
          'serene-10kw': 'G1',
          'serene-15kw': 'G1-1/4',
          'serene-18kw': 'G1-1/2',
          'serene-24kw': 'G1-1/2'
        },
        'Pressure drop at rating water flow (kPa)': {
          'serene-10kw': '27',
          'serene-15kw': '30',
          'serene-18kw': '32',
          'serene-24kw': '35'
        },
        'Operating temperature range(Heating mode) (°C)': {
          'serene-10kw': '-25~45',
          'serene-15kw': '-25~45',
          'serene-18kw': '-25~45',
          'serene-24kw': '-25~45'
        },
        'Operating temperature range(Cooling mode) (°C)': {
          'serene-10kw': '16~45',
          'serene-15kw': '16~45',
          'serene-18kw': '16~45',
          'serene-24kw': '16~45'
        },
        'Unpacked Dimensions (L*D*H) (mm)': {
          'serene-10kw': '1100*445*850',
          'serene-15kw': '1110*480*850',
          'serene-18kw': '1110*445*1450',
          'serene-24kw': '1170*445*1450'
        },
        'Packed Dimensions (L*D*H) (mm)': {
          'serene-10kw': '1160*530*1010',
          'serene-15kw': '1160*565*1010',
          'serene-18kw': '1170*530*1610',
          'serene-24kw': '1170*530*1610'
        },
        'UnPacked Weight (kg)': {
          'serene-10kw': '107',
          'serene-15kw': '124',
          'serene-18kw': '151',
          'serene-24kw': '160'
        },
        'Packed Weight (kg)': {
          'serene-10kw': '119',
          'serene-15kw': '136',
          'serene-18kw': '168',
          'serene-24kw': '177'
        }
      },
      downloads: [
        {
          title: 'Manuali i Perdorimit Serene',
          description: 'Udhëzues për përdorimin e Serene Climate (PDF)',
          url: '/downloads/serene-manual.pdf',
          fileSize: '3.7 MB'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-vanguard', 'pompa-nxehtesie-apex', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-apex',
      title: 'Pompa Termike Apex Heating',
      description: 'Pompë termike ajër-ujë A+++ me ftohës natyral R290 dhe temperaturë të lartë uji (75°C).',
      price: 'Kontakto',
      image: '/produktet/pompa-termike-apex.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A+++ Efiçencë',
          bgColor: '#e7f9ed', // Green
          textColor: '#18a757'
        },
        {
          text: 'R290 Ftohës Natyral',
          bgColor: '#dcfce7', // Lighter green
          textColor: '#16a34a'
        },
        {
          text: 'Temp. e Lartë 75°C',
          bgColor: '#fee2e2', // Red
          textColor: '#dc2626'
        },
        {
          text: 'Inverter',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A+++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '15kW - 32kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 75°C',
          icon: '/icons/temperature.svg'
        },
        {
          name: 'Ftohësi',
          value: 'R290 (Propan)',
          icon: '/icons/refrigerant.svg' // Use appropriate icon
        }
      ],
      models: [
        {
          id: 'apex-6kw',
          name: 'Apex Heating 6kW',
          price: 'Kontakto'
        },
        {
          id: 'apex-12kw-monophase',
          name: 'Apex Heating 12kW Monofazë',
          price: 'Kontakto'
        },        
        {
          id: 'apex-12kw-triphase',
          name: 'Apex Heating 12kW Trifazë',
          price: 'Kontakto'
        },
        {
          id: 'apex-18kw-monophase',
          name: 'Apex Heating 18kW Monofazë',
          price: 'Kontakto'
        },
        {
          id: 'apex-18kw-triphase',
          name: 'Apex Heating 18kW Trifazë',
          price: 'Kontakto'
        }
        // Add other capacities if applicable
      ],
      features: [
        'Klasa më e lartë e Efikasitetit Energjetik A+++',
        'Ftohës natyral R290 me GWP (Potencial Ngrohje Globale) shumë të ulët',
        'Teknologji Inverter për përshtatje të fuqisë dhe kursim maksimal',
        'Temperaturë e lartë e daljes së ujit deri në 75°C, ideale për radiatorë ekzistues',
        'Pompë qarkullimi e integruar me efikasitet të lartë',
        'Enë ekspansioni e integruar',
        'Valvula sigurie dhe komponentë hidraulikë të integruar',
        'Operim shumë i qetë',
        'Kontroll inteligjent me mundësi WiFi (Opsionale)',
        'Kapacitete: 15kW deri 32kW'
      ],
      longDescription: `
        <p>Apex Heating përfaqëson majën e teknologjisë së pompave termike, duke përdorur ftohësin natyral R290 (Propan) për një ndikim minimal mjedisor dhe efikasitet të jashtëzakonshëm A+++.</p>
        
        <p>Karakteristika kryesore e kësaj pompe është aftësia për të prodhuar ujë me temperaturë deri në 75°C, duke e bërë të përshtatshme për zëvendësimin e kaldajave të vjetra në sisteme me radiatorë tradicionalë, pa pasur nevojë për ndryshime në sistemin ekzistues.</p>

        <p>Përfshin komponentë hidraulikë të integruar për instalim të lehtë dhe ofron operim të besueshëm edhe në temperatura të ulëta të ambientit.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë (Temp. Lartë)',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R290 (Propan)',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '2-5 vite (Shembull - Specify)'
      },
      specifications: {
        'Model No.': {
          'apex-6kw': 'BLN-006TC1',
          'apex-12kw-monophase': 'BLN-012TC1',
          'apex-12kw-triphase': 'BLN-012TC3',
          'apex-18kw-monophase': 'BLN-018TC1',
          'apex-18kw-triphase': 'BLN-018TC3'
        },
        'Power supply (V/Ph/Hz)': {
          'apex-6kw': '220~240/1/50',
          'apex-12kw-monophase': '220~240/1/50',
          'apex-12kw-triphase': '380~415/3/50',
          'apex-18kw-monophase': '220~240/1/50',
          'apex-18kw-triphase': '380~415/3/50'
        },
        'Heating Capacity (A7/6°C,W30/35°C) (kW)': {
          'apex-6kw': '2.92 ~ 9.10',
          'apex-12kw-monophase': '4.30 ~ 15.20',
          'apex-12kw-triphase': '4.30 ~ 15.20',
          'apex-18kw-monophase': '7.24 ~ 21.90',
          'apex-18kw-triphase': '7.24 ~ 21.90'
        },
        'Heating Power Input (A7/6°C,W30/35°C) (kW)': {
          'apex-6kw': '0.61 ~ 2.11',
          'apex-12kw-monophase': '0.87 ~ 3.73',
          'apex-12kw-triphase': '0.87 ~ 3.73',
          'apex-18kw-monophase': '1.50 ~ 5.88',
          'apex-18kw-triphase': '1.50 ~ 5.88'
        },
        'Heating Current Input (A7/6°C,W30/35°C) (A)': {
          'apex-6kw': '2.80 ~ 9.25',
          'apex-12kw-monophase': '4.02 ~ 16.38',
          'apex-12kw-triphase': '1.78 ~ 6.04',
          'apex-18kw-monophase': '6.86 ~ 30.25',
          'apex-18kw-triphase': '2.82 ~ 9.16'
        },
        'Heating COP (A7/6°C,W30/35°C) (W/W)': {
          'apex-6kw': '4.31 ~ 5.66',
          'apex-12kw-monophase': '4.07 ~ 5.57',
          'apex-12kw-triphase': '4.07 ~ 5.57',
          'apex-18kw-monophase': '3.82 ~ 5.59',
          'apex-18kw-triphase': '3.82 ~ 5.59'
        },
        'Heating Capacity (A7/6°C,W47/55°C) (kW)': {
          'apex-6kw': '2.99 ~ 8.16',
          'apex-12kw-monophase': '4.25 ~ 14.55',
          'apex-12kw-triphase': '4.25 ~ 14.55',
          'apex-18kw-monophase': '6.36 ~ 19.45',
          'apex-18kw-triphase': '6.36 ~ 19.45'
        },
        'Heating Power Input (A7/6°C,W47/55°C) (kW)': {
          'apex-6kw': '1.03 ~ 2.92',
          'apex-12kw-monophase': '1.45 ~ 4.28',
          'apex-12kw-triphase': '1.45 ~ 4.28',
          'apex-18kw-monophase': '2.15 ~ 6.85',
          'apex-18kw-triphase': '2.15 ~ 6.85'
        },
        'Heating Current Input (A7/6°C,W47/55°C) (A)': {
          'apex-6kw': '4.57 ~ 12.79',
          'apex-12kw-monophase': '6.71 ~ 18.80',
          'apex-12kw-triphase': '2.84 ~ 6.78',
          'apex-18kw-monophase': '9.84 ~ 30.12',
          'apex-18kw-triphase': '3.71 ~ 10.60'
        },
        'Heating COP (A7/6°C,W47/55°C) (W/W)': {
          'apex-6kw': '2.79 ~ 3.46',
          'apex-12kw-monophase': '2.83 ~ 3.45',
          'apex-12kw-triphase': '2.83 ~ 3.45',
          'apex-18kw-monophase': '2.84 ~ 3.57',
          'apex-18kw-triphase': '2.84 ~ 3.57'
        },
        'Cooling Capacity (A35/24°C,W12/7°C) (kW)': {
          'apex-6kw': '1.38 ~ 5.70',
          'apex-12kw-monophase': '3.65 ~ 11.04',
          'apex-12kw-triphase': '3.65 ~ 11.04',
          'apex-18kw-monophase': '4.55 ~ 17.20',
          'apex-18kw-triphase': '4.55 ~ 17.20'
        },
        'Cooling Power Input (A35/24°C,W12/7°C) (kW)': {
          'apex-6kw': '0.67 ~ 2.44',
          'apex-12kw-monophase': '1.12 ~ 3.97',
          'apex-12kw-triphase': '1.12 ~ 3.97',
          'apex-18kw-monophase': '1.85 ~ 7.31',
          'apex-18kw-triphase': '1.85 ~ 7.31'
        },
        'Cooling Current Input (A35/24°C,W12/7°C) (A)': {
          'apex-6kw': '3.06 ~ 10.27',
          'apex-12kw-monophase': '5.18 ~ 17.44',
          'apex-12kw-triphase': '1.97 ~ 6.30',
          'apex-18kw-monophase': '8.47 ~ 32.1',
          'apex-18kw-triphase': '2.99 ~ 11.26'
        },
        'ERP Level (Outlet water temp. at 35°C)': {
          'apex-6kw': 'A+++',
          'apex-12kw-monophase': 'A+++',
          'apex-12kw-triphase': 'A+++',
          'apex-18kw-monophase': 'A+++',
          'apex-18kw-triphase': 'A+++'
        },
        'Max. input power (kW)': {
          'apex-6kw': '3.5',
          'apex-12kw-monophase': '5.40',
          'apex-12kw-triphase': '5.85',
          'apex-18kw-monophase': '7.5',
          'apex-18kw-triphase': '10.5'
        },
        'Max. input current (A)': {
          'apex-6kw': '15.0',
          'apex-12kw-monophase': '25.0',
          'apex-12kw-triphase': '10.0',
          'apex-18kw-monophase': '35.0',
          'apex-18kw-triphase': '17.0'
        },
        'Refrigerant Type / Charge / GWP (... / kg)': {
          'apex-6kw': 'R290 / 0.55 / 3',
          'apex-12kw-monophase': 'R290 / 1.05 / 3',
          'apex-12kw-triphase': 'R290 / 1.05 / 3',
          'apex-18kw-monophase': 'R290 / 1.4 / 3',
          'apex-18kw-triphase': 'R290 / 1.4 / 3'
        },
        'Rated water flow (m3/h)': {
          'apex-6kw': '1.00',
          'apex-12kw-monophase': '2.06',
          'apex-12kw-triphase': '2.06',
          'apex-18kw-monophase': '3.1',
          'apex-18kw-triphase': '3.1'
        },
        'Fan quantity': {
          'apex-6kw': '1',
          'apex-12kw-monophase': '1',
          'apex-12kw-triphase': '1',
          'apex-18kw-monophase': '2',
          'apex-18kw-triphase': '2'
        },
        'Fan motor type': {
          'apex-6kw': 'DC inverter',
          'apex-12kw-monophase': 'DC inverter',
          'apex-12kw-triphase': 'DC inverter',
          'apex-18kw-monophase': 'DC inverter',
          'apex-18kw-triphase': 'DC inverter'
        },
        'Compressor': {
          'apex-6kw': 'DC inverter',
          'apex-12kw-monophase': 'DC inverter',
          'apex-12kw-triphase': 'DC inverter',
          'apex-18kw-monophase': 'DC inverter',
          'apex-18kw-triphase': 'DC inverter'
        },
        'Circulating pump': {
          'apex-6kw': 'Inverter type / Built-in',
          'apex-12kw-monophase': 'Inverter type / Built-in',
          'apex-12kw-triphase': 'Inverter type / Built-in',
          'apex-18kw-monophase': 'Inverter type / Built-in',
          'apex-18kw-triphase': 'Inverter type / Built-in'
        },
        'IP Class': {
          'apex-6kw': 'IPX4',
          'apex-12kw-monophase': 'IPX4',
          'apex-12kw-triphase': 'IPX4',
          'apex-18kw-monophase': 'IPX4',
          'apex-18kw-triphase': 'IPX4'
        },
        'Sound pressure at 1m distance (dB(A))': {
          'apex-6kw': '46',
          'apex-12kw-monophase': '53',
          'apex-12kw-triphase': '54',
          'apex-18kw-monophase': '56',
          'apex-18kw-triphase': '56'
        },
        'Max outlet water temperature (°C)': {
          'apex-6kw': '75',
          'apex-12kw-monophase': '75',
          'apex-12kw-triphase': '75',
          'apex-18kw-monophase': '75',
          'apex-18kw-triphase': '75'
        },
        'Water piping connections (inch)': {
          'apex-6kw': 'G1',
          'apex-12kw-monophase': 'G1',
          'apex-12kw-triphase': 'G1',
          'apex-18kw-monophase': 'G1 - 1/4',
          'apex-18kw-triphase': 'G1 - 1/4'
        },
        'Water Pressure drop (kPa)': {
          'apex-6kw': '20',
          'apex-12kw-monophase': '20',
          'apex-12kw-triphase': '20',
          'apex-18kw-monophase': '55',
          'apex-18kw-triphase': '55'
        },
        'Operating temperature range (heating mode) (°C)': {
          'apex-6kw': '-25~45',
          'apex-12kw-monophase': '-25~45',
          'apex-12kw-triphase': '-25~45',
          'apex-18kw-monophase': '-25~45',
          'apex-18kw-triphase': '-25~45'
        },
        'Operating temperature range (cooling mode) (°C)': {
          'apex-6kw': '16~45',
          'apex-12kw-monophase': '16~45',
          'apex-12kw-triphase': '16~45',
          'apex-18kw-monophase': '16~45',
          'apex-18kw-triphase': '16~45'
        },
        'Unpacked dimensions (L*D*H) (mm)': {
          'apex-6kw': '1187*418*805',
          'apex-12kw-monophase': '1287*448*904',
          'apex-12kw-triphase': '1287*448*904',
          'apex-18kw-monophase': '1187*488*1456',
          'apex-18kw-triphase': '1187*488*1456'
        },
        'Packed dimensions (L*D*H) (mm)': {
          'apex-6kw': '1217*463*920',
          'apex-12kw-monophase': '1317*493*1020',
          'apex-12kw-triphase': '1317*493*1020',
          'apex-18kw-monophase': '1217*538*1570',
          'apex-18kw-triphase': '1217*538*1570'
        },
        'UnPacked weight (kg)': {
          'apex-6kw': '110',
          'apex-12kw-monophase': '134',
          'apex-12kw-triphase': '134',
          'apex-18kw-monophase': '195',
          'apex-18kw-triphase': '195'
        },
        'Packed weight (kg)': {
          'apex-6kw': '122',
          'apex-12kw-monophase': '146',
          'apex-12kw-triphase': '146',
          'apex-18kw-monophase': '208',
          'apex-18kw-triphase': '208'
        }
      },
      downloads: [
        {
          title: 'Manuali i Perdorimit Apex',
          description: 'Udhëzues për përdorimin e Apex Heating (PDF)',
          url: '/downloads/apex-manual.pdf',
          fileSize: '2.1 MB'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-maxi', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-maxi',
      title: 'Pompa Termike Split Maxi Comfort',
      description: 'Pompë termike ajër-ujë tip Split A+++ me ftohës R32, ideale për hapësira rezidenciale.',
      price: 'Kontakto',
      image: '/produktet/pompa-termike-maxi.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A+++ Efiçencë',
          bgColor: '#e7f9ed', // Green
          textColor: '#18a757'
        },
        {
          text: 'R32 Ftohës',
          bgColor: '#e5f6fd', // Blue
          textColor: '#0284c7'
        },
        {
          text: 'Tip Split',
          bgColor: '#ede9fe', // Purple
          textColor: '#6d28d9'
        },
        {
          text: 'Inverter',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A+++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '6kW - 16kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 60°C',
          icon: '/icons/temperature.svg' // Adjust temp if needed
        },
        {
          name: 'Tipi',
          value: 'Split',
          icon: '/icons/split-type.svg' // Assuming an icon exists
        }
      ],
      models: [
        {
          id: 'maxi-50kw',
          name: 'Maxi Comfort Monoblock 50kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-100kw',
          name: 'Maxi Comfort Monoblock 100kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-200kw',
          name: 'Maxi Comfort Monoblock 200kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-400kw',
          name: 'Maxi Comfort Monoblock 400kW',
          price: 'Kontakto'
        }
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A+++',
        'Ftohës ekologjik R32',
        'Teknologji Inverter DC për modulim të vazhdueshëm',
        'Dizajn Split (njësi e jashtme dhe e brendshme) për fleksibilitet instalimi',
        'Temperaturë maksimale e ujit 60°C (Shembull)',
        'Operim i qetë si për njësinë e brendshme ashtu edhe atë të jashtme',
        'Kontroll inteligjent me ekran LCD dhe mundësi WiFi',
        'Mbrojtje nga ngrirja',
        'Kapacitete të ndryshme: 6kW, 8kW, 10kW, 12kW, 16kW'
      ],
      longDescription: `
        <p>Pompa termike Maxi Comfort Split ofron një zgjidhje fleksibël dhe me efikasitet të lartë A+++ për ngrohjen dhe ftohjen (nëse ka funksion reversibël) e hapësirave rezidenciale. Dizajni Split ndan komponentët kryesorë në një njësi të jashtme dhe një njësi të brendshme hidraulike, duke lejuar instalim më të lehtë dhe më të përshtatshëm.</p>
        
        <p>Duke përdorur ftohësin R32 dhe teknologjinë Inverter, Maxi Comfort siguron performancë optimale dhe kursime të konsiderueshme energjie. Njësia e brendshme kompakte përmban elementet hidraulike kyçe dhe mund të instalohet lehtësisht në një hapësirë teknike ose lavanderi.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë Split',
        'Teknologjia': 'Inverter DC',
        'Ftohësi': 'R32',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '2-5 vite (Shembull - Specify)'
      },
      specifications: {
        'Model No.': {
          'maxi-50kw': 'DLN-050TA1',
          'maxi-100kw': 'DLN-100TA1',
          'maxi-200kw': 'DLN-200TA1',
          'maxi-400kw': 'DLN-400TA1'
        },
        'Power supply (V/Ph/Hz)': {
          'maxi-50kw': '380~415/3/50',
          'maxi-100kw': '380~415/3/50',
          'maxi-200kw': '380~415/3/50',
          'maxi-400kw': '380~415/3/50'
        },
        'Heating Capacity at Air 7°C/6°C, Water 30°C in, 35°C out - Heating Capacity (kW)': {
          'maxi-50kw': '45',
          'maxi-100kw': '90',
          'maxi-200kw': '180',
          'maxi-400kw': '350'
        },
        'Heating Capacity at Air 7°C/6°C, Water 30°C in, 35°C out - Power Input (kW)': {
          'maxi-50kw': '10.3',
          'maxi-100kw': '20.8',
          'maxi-200kw': '42',
          'maxi-400kw': '81.4'
        },
        'Heating Capacity at Air 7°C/6°C, Water 30°C in, 35°C out - COP': {
          'maxi-50kw': '4.36',
          'maxi-100kw': '4.32',
          'maxi-200kw': '4.25',
          'maxi-400kw': '4.30'
        },
        'Heating Capacity at Air 7°C/6°C, Water 50°C in, 55°C out - Heating Capacity (kW)': {
          'maxi-50kw': '36',
          'maxi-100kw': '67',
          'maxi-200kw': '167',
          'maxi-400kw': '328'
        },
        'Heating Capacity at Air 7°C/6°C, Water 50°C in, 55°C out - Power Input (kW)': {
          'maxi-50kw': '15.5',
          'maxi-100kw': '25.48',
          'maxi-200kw': '56.7',
          'maxi-400kw': '113.9'
        },
        'Heating Capacity at Air 7°C/6°C, Water 50°C in, 55°C out - COP': {
          'maxi-50kw': '2.32',
          'maxi-100kw': '2.63',
          'maxi-200kw': '2.95',
          'maxi-400kw': '2.88'
        },
        'Heating Capacity at Air -12°C/-14°C, Water 50°C in, 55°C out - Heating Capacity (kW)': {
          'maxi-50kw': '24',
          'maxi-100kw': '40',
          'maxi-200kw': '107',
          'maxi-400kw': '205'
        },
        'Heating Capacity at Air -12°C/-14°C, Water 50°C in, 55°C out - Power Input (kW)': {
          'maxi-50kw': '15.4',
          'maxi-100kw': '25',
          'maxi-200kw': '54',
          'maxi-400kw': '104.6'
        },
        'Heating Capacity at Air -12°C/-14°C, Water 50°C in, 55°C out - COP': {
          'maxi-50kw': '1.55',
          'maxi-100kw': '1.60',
          'maxi-200kw': '1.98',
          'maxi-400kw': '1.96'
        },
        'Cooling Capacity at Air 35°C/24°C, Water 12°C in, 7°C out - Cooling Capacity (kW)': {
          'maxi-50kw': '30',
          'maxi-100kw': '60',
          'maxi-200kw': '140',
          'maxi-400kw': '268'
        },
        'Cooling Capacity at Air 35°C/24°C, Water 12°C in, 7°C out - Power Input (kW)': {
          'maxi-50kw': '11.9',
          'maxi-100kw': '22.9',
          'maxi-200kw': '43.8',
          'maxi-400kw': '87.9'
        },
        'Cooling Capacity at Air 35°C/24°C, Water 12°C in, 7°C out - EER': {
          'maxi-50kw': '2.53',
          'maxi-100kw': '2.62',
          'maxi-200kw': '3.19',
          'maxi-400kw': '3.05'
        },
        'Max Power Input (kW)': {
          'maxi-50kw': '16.8',
          'maxi-100kw': '36.5',
          'maxi-200kw': '70.1',
          'maxi-400kw': '145.0'
        },
        'Max Current (A)': {
          'maxi-50kw': '31.5',
          'maxi-100kw': '63.3',
          'maxi-200kw': '132.5',
          'maxi-400kw': '260.0'
        },
        'Compressor quantity': {
          'maxi-50kw': '1',
          'maxi-100kw': '2',
          'maxi-200kw': '2',
          'maxi-400kw': '4'
        },
        'Expansion Valve (mm)': {
          'maxi-50kw': 'Saginomiya/EEV',
          'maxi-100kw': 'Saginomiya/EEV',
          'maxi-200kw': 'Danfoss/EEV',
          'maxi-400kw': 'Danfoss/EEV'
        },
        'Air Flow Direction': {
          'maxi-50kw': 'Vertical',
          'maxi-100kw': 'Vertical',
          'maxi-200kw': 'Vertical',
          'maxi-400kw': 'Vertical'
        },
        'Water Flow Volume (m³/h)': {
          'maxi-50kw': '8',
          'maxi-100kw': '16',
          'maxi-200kw': '32',
          'maxi-400kw': '60'
        },
        'Water Pressure Drop (kPa)': {
          'maxi-50kw': '50',
          'maxi-100kw': '50',
          'maxi-200kw': '48',
          'maxi-400kw': '50'
        },
        'Dimensions(L*W*H) (mm)': {
          'maxi-50kw': '1252*1076*1870',
          'maxi-100kw': '2198*1096*2176',
          'maxi-200kw': '2300*1150*2400',
          'maxi-400kw': '2800*2200*2450'
        },
        'Working temperature range (°C)': {
          'maxi-50kw': '-25 ~ 48',
          'maxi-100kw': '-25 ~ 48',
          'maxi-200kw': '-25 ~ 48',
          'maxi-400kw': '-25 ~ 48'
        },
        'Noise (dB(A))': {
          'maxi-50kw': '≤62',
          'maxi-100kw': '≤67',
          'maxi-200kw': '≤70',
          'maxi-400kw': '≤76'
        },
        'IP class': {
          'maxi-50kw': 'IPX4',
          'maxi-100kw': 'IPX4',
          'maxi-200kw': 'IPX4',
          'maxi-400kw': 'IPX4'
        },
        'Net Weight (kg)': {
          'maxi-50kw': '450',
          'maxi-100kw': '800',
          'maxi-200kw': '1330',
          'maxi-400kw': '2186'
        },
        'Water connection (mm)': {
          'maxi-50kw': 'DN 40',
          'maxi-100kw': 'DN 50',
          'maxi-200kw': 'Flange DN 80',
          'maxi-400kw': 'Flange DN 100'
        }
      },
      downloads: [
        {
          title: 'Manuali i Perdorimit Maxi Monoblock',
          description: 'Detajet teknike dhe udhëzimet e instalimit (PDF)',
          url: '/downloads/maxi-manual.pdf',
          fileSize: '2.0 MB'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-apex', 'pompa-nxehtesie-sinceko']
    },
    {
      id: 'pompa-nxehtesie-sinceko',
      title: 'Pompa Termike Sinceko Split',
      description: 'Pompë termike ajër-ujë tip Split A++ me ftohës R32, zgjidhje ekonomike për ngrohje.',
      price: 'Kontakto',
      image: '/produktet/pompa-gjeotermike-sinceko.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A++ Efiçencë',
          bgColor: '#f0fdf4', // Lighter Green
          textColor: '#16a34a'
        },
        {
          text: 'R32 Ftohës',
          bgColor: '#e5f6fd', // Blue
          textColor: '#0284c7'
        },
        {
          text: 'Tip Split',
          bgColor: '#ede9fe', // Purple
          textColor: '#6d28d9'
        },
        {
          text: 'Inverter',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '6kW - 16kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 55°C',
          icon: '/icons/temperature.svg' // Adjust temp if needed
        },
        {
          name: 'Tipi',
          value: 'Split',
          icon: '/icons/split-type.svg'
        }
      ],
      models: [
        {
          id: 'sinceko-30kw',
          name: 'Sinceko 30kW',
          price: 'Kontakto'
        },
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A++',
        'Ftohës ekologjik R32',
        'Teknologji Inverter për funksionim efikas',
        'Dizajn Split me njësi të jashtme dhe të brendshme',
        'Temperaturë maksimale e ujit 55°C (Shembull)',
        'Operim i besueshëm dhe ekonomik',
        'Kontrollues i thjeshtë dhe intuitiv',
        'Instalim fleksibël',
        'Kapacitete: 6kW, 8kW, 10kW, 12kW, 16kW'
      ],
      longDescription: `
        <p>Pompa termike Sinceko Split ofron një balancë të mirë midis performancës dhe kostos, me një efikasitet A++. Është një zgjidhje e besueshme për ngrohjen e shtëpive duke përdorur teknologjinë ajër-ujë.</p>
        
        <p>Ashtu si modelet e tjera Split, ajo përbëhet nga një njësi e jashtme dhe një njësi e brendshme, duke lejuar fleksibilitet gjatë instalimit. Përdor ftohësin R32 dhe teknologjinë Inverter për të siguruar ngrohje efikase.</p>
      `,
      details: {
        'Prodhuesi': 'Sinceko (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë Split',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R32',
        'Klasa e Energjisë': 'A++',
        'Garancia': '2 vite (Shembull - Specify)'
      },
      specifications: {
        'Model': {
          'sinceko-30kw': 'BWH-30F1M3'
        },
        'Power supply (V/Ph/Hz)': {
          'sinceko-30kw': '380/3/50'
        },
        'Heating capacity W10/W35 (1) (kW)': {
          'sinceko-30kw': '30.20'
        },
        'COP W10/W35': {
          'sinceko-30kw': '4.67'
        },
        'Heating capacity W10/W55 (2) (kW)': {
          'sinceko-30kw': '26.88'
        },
        'COP W10/W55': {
          'sinceko-30kw': '3.15'
        },
        'Heating capacity B0/W35 (3) (kW)': {
          'sinceko-30kw': '28.09'
        },
        'COP B0/W35': {
          'sinceko-30kw': '4.30'
        },
        'Heating capacity B0/W55 (4) (kW)': {
          'sinceko-30kw': '23.56'
        },
        'COP B0/W55': {
          'sinceko-30kw': '2.51'
        },
        'Heating capacity B-5/W45 (5) (kW)': {
          'sinceko-30kw': '21.29'
        },
        'COP B-5/W45': {
          'sinceko-30kw': '2.50'
        },
        'Heating capacity W15/W35 (6) (kW)': {
          'sinceko-30kw': '33.22'
        },
        'COP W15/W35': {
          'sinceko-30kw': '5.19'
        },
        'Cooling capacity W30/W7 (7) (kW)': {
          'sinceko-30kw': '26.46'
        },
        'EER W30/W7': {
          'sinceko-30kw': '4.14'
        },
        'Rated current (A)': {
          'sinceko-30kw': '13.0'
        },
        'Max. water temperature (°C)': {
          'sinceko-30kw': '60'
        },
        'Rated water temperature (°C)': {
          'sinceko-30kw': '55'
        },
        'Water flow (user side) (m3/h)': {
          'sinceko-30kw': '5.20'
        },
        'Water flow (ground source side) (m3/h)': {
          'sinceko-30kw': '4.70'
        },
        'Noise (dB(A))': {
          'sinceko-30kw': '43'
        },
        'Compressor Brand': {
          'sinceko-30kw': 'Panasonic'
        },
        'Compressor Type': {
          'sinceko-30kw': 'Scroll'
        },
        'Compressor Quantity': {
          'sinceko-30kw': '2'
        },
        'Refrigerant': {
          'sinceko-30kw': 'R410A'
        },
        'Condenser': {
          'sinceko-30kw': 'Plate type'
        },
        'Evaporator': {
          'sinceko-30kw': 'Plate type'
        },
        'Throttling device': {
          'sinceko-30kw': 'EEV'
        },
        'Net weight (kg)': {
          'sinceko-30kw': '160'
        },
        'Gross weight (kg)': {
          'sinceko-30kw': '175'
        },
        'Net dimensions (mm)': {
          'sinceko-30kw': '708*1048*750'
        },
        'Packing dimensions (mm)': {
          'sinceko-30kw': '755*1155*900'
        }
      },
      downloads: [
        {
          title: 'Manuali i Perdorimit Sinceko',
          description: 'Specifikimet teknike bazë (PDF)',
          url: '/downloads/sinceko-manual.pdf',
          fileSize: '1.5 MB'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-maxi', 'pompa-nxehtesie-apex', 'kalldaja-elektrike']
    },
    // Kalldajat
    {
      id: 'kalldaja-og',
      title: 'Kalldaja me Gaz Kondensuese OG Comfort',
      description: 'Kalldajë murale me gaz kondensuese me efikasitet të lartë për ngrohje dhe ujë të ngrohtë sanitar.',
      price: 'Kontakto',
      image: '/produktet/kalldaja-og.png',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja',
      badges: [
        {
          text: 'Gaz Natyral/LPG',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        },
        {
          text: 'Kondensuese',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'A Efiçencë',
          bgColor: '#f0fdf4', // Lighter green
          textColor: '#16a34a'
        },
        {
          text: 'Ujë i Ngrohtë',
          bgColor: '#ffe4e6', // Pinkish
          textColor: '#e11d48'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: '>92% (ErP A)',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '18kW - 35kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Karburanti',
          value: 'Gaz Natyral / LPG',
          icon: '/icons/gas.svg' // Assuming icon exists
        },
        {
          name: 'Tipi',
          value: 'Murale, Kondensuese',
          icon: '/icons/wall-mounted.svg' // Assuming icon exists
        }
      ],
      models: [
        {
          id: 'og-18kw',
          name: 'OG Comfort 18kW',
          price: 'Kontakto'
        },
        {
          id: 'og-24kw',
          name: 'OG Comfort 24kW',
          price: 'Kontakto'
        },
        {
          id: 'og-30kw',
          name: 'OG Comfort 30kW',
          price: 'Kontakto'
        },
        {
          id: 'og-35kw',
          name: 'OG Comfort 35kW',
          price: 'Kontakto'
        }
      ],
      features: [
        'Teknologji kondensimi për efikasitet të lartë dhe kursim karburanti',
        'Klasa e Efikasitetit Energjetik A (Ngrohje & Ujë Sanitar)',
        'E përshtatshme për Gaz Natyral dhe LPG (me kit konvertimi)',
        'Shkëmbyes nxehtësie primar prej çeliku inoks',
        'Pompë qarkullimi me efikasitet të lartë (Low Energy)',
        'Prodhim i menjëhershëm i ujit të ngrohtë sanitar (modele combi)',
        'Ekran LCD intuitiv dhe kontroll i lehtë',
        'Operim i qetë',
        'Dizajn kompakt mural',
        'Mbrojtje nga ngrirja dhe diagnostikim i avancuar',
        'Kapacitete: 18kW, 24kW, 30kW, 35kW'
      ],
      longDescription: `
        <p>Kalldaja murale me gaz OG Comfort përdor teknologjinë e kondensimit për të maksimizuar efikasitetin dhe për të minimizuar konsumin e gazit dhe emetimet. Kjo e bën atë një zgjidhje ideale për ngrohje qendrore dhe prodhim të ujit të ngrohtë sanitar në banesa dhe apartamente.</p>
        
        <p>Me një shkëmbyes nxehtësie prej inoksi dhe një pompë qarkullimi moderne, OG Comfort siguron performancë të besueshme dhe jetëgjatësi. Kontrolli i saj i thjeshtë dhe ekrani LCD e bëjnë të lehtë për përdoruesin menaxhimin e temperaturës dhe funksioneve të kalldajës.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK/Partner (Shembull)',
        'Tipi': 'Kalldajë Murale me Gaz Kondensuese',
        'Karburanti': 'Gaz Natyral (G20), LPG (G31)',
        'Klasa e Energjisë (Ngrohje)': 'A',
        'Klasa e Energjisë (Ujë Sanitar)': 'A (Profilli XL - Shembull)',
        'Garancia': '2-3 vite (Shembull - Specify)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Broshura Teknike OG Comfort (Shembull)',
          description: 'Specifikimet, dimensionet dhe udhëzimet (PDF, Shembull)',
          url: '/downloads/og-comfort-brochure-placeholder.pdf',
          fileSize: '1.9 MB (Shembull)'
        },
        {
          title: 'Manuali Përdorimit OG Comfort (Shembull)',
          description: 'Udhëzime për përdorim dhe mirëmbajtje (PDF, Shembull)',
          url: '/downloads/og-comfort-manual-placeholder.pdf',
          fileSize: '2.5 MB (Shembull)'
        }
      ],
      relatedProducts: ['kalldaja-elektrike', 'pompa-nxehtesie-apex', 'radiator']
    },
    {
      id: 'kalldaja-mp',
      title: 'Kalldaja Elektrike ECOTEK MP',
      description: 'Kalldajë elektrike e fuqishme me kontroll dixhital dhe WiFi, e përshtatshme për sisteme ngrohjeje.',
      price: 'Kontakto',
      image: '/produktet/kalldaja-mp.png',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja-elektrike',
      badges: [
        {
          text: 'Kontroll WiFi',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Ekran Dixhital',
          bgColor: '#f3e8ff',
          textColor: '#9333ea'
        },
        {
          text: 'Efikase',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Fuqia',
          value: '6kW - 27kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Kontrolli',
          value: 'WiFi + Dixhital',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Garancia',
          value: '2 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Temp. Ujit',
          value: '90°C',
          icon: '/icons/temperature.svg'
        }
      ],
      models: [
        {
          id: 'mp-6',
          name: 'MP-6 (6kW)',
          price: 'Kontakto'
        },
        {
          id: 'mp-27',
          name: 'MP-27 (27kW)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Efficient Electric Heating',
        'Water Pressure Protection',
        'Digital Display, Wi-Fi connection',
        'Higher Water Temp 90 C',
        'Capacities 6kW - 27kW',
        'Ndërtim robust dhe i qëndrueshëm'
      ],
      longDescription: `
        <p>ECOTEK MP është një kalldajë elektrike e projektuar për të ofruar ngrohje të besueshme dhe efikase. E pajisur me kontroll dixhital dhe WiFi, ajo lejon menaxhim të lehtë të temperaturës dhe programeve të ngrohjes.</p>
        
        <p>Ndërtimi i saj robust e bën të përshtatshme për përdorim afatgjatë në sisteme të ndryshme ngrohjeje qendrore.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Elektrike',
        'Kontrolli': 'Dixhital, WiFi',
        'Garancia': '2 vite (Shembull)',
        'Instalimi': 'Standard'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Manuali i Përdorimit MP (Shembull)',
          description: 'Udhëzime për kaldajën MP (PDF, Shembull)',
          url: '/downloads/mp-manual-placeholder.pdf',
          fileSize: '1.9 MB (Shembull)'
        },
        {
          title: 'Broshura Teknike MP (Shembull)',
          description: 'Specifikimet teknike për serinë MP (PDF, Shembull)',
          url: '/downloads/mp-brochure-placeholder.pdf',
          fileSize: '1.3 MB (Shembull)'
        }
      ],
      relatedProducts: ['kalldaja-og', 'kalldaja-jp', 'radiator-gypor']
    },
    {
      id: 'kalldaja-jp',
      title: 'Kalldaja Elektrike ECOTEK JP',
      description: 'Kalldajë elektrike kompakte dhe ekonomike me kontroll dixhital dhe WiFi.',
      price: 'Kontakto',
      image: '/produktet/kalldaja-jp.png',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja-elektrike',
      badges: [
        {
          text: 'Kontroll WiFi',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Ekonomike',
          bgColor: '#fefce8',
          textColor: '#ca8a04'
        },
        {
          text: 'Kompakte',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Fuqia',
          value: '6kW - 27kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Kontrolli',
          value: 'WiFi + Dixhital',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Garancia',
          value: '2 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Temp. Ujit',
          value: '90°C',
          icon: '/icons/temperature.svg'
        }
      ],
      models: [
        {
          id: 'jp-6',
          name: 'JP-6 (6kW)',
          price: 'Kontakto'
        },
        {
          id: 'jp-27',
          name: 'JP-27 (27kW)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Efficient Electric Heating',
        'Water Pressure Protection',
        'Digital Display, Wi-Fi connection',
        'Higher Water Temp 90 C',
        'Capacities 6kW - 27kW',
        'Dizajn shumë kompakt, ideal për hapësira të vogla'
      ],
      longDescription: `
        <p>ECOTEK JP është zgjidhja perfekte kur hapësira është e kufizuar. Kjo kalldajë elektrike super-kompakte ofron ngrohje efikase dhe vjen me kontroll dixhital dhe WiFi për lehtësi përdorimi.</p>
        
        <p>Duke përdorur teknologjinë e fundit, JP ofron fuqi të mjaftueshme për të ngrohur apartamente dhe shtëpi të vogla në mënyrë ekonomike.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Elektrike Super-Kompakte',
        'Kontrolli': 'Dixhital, WiFi',
        'Garancia': '2 vite (Shembull)',
        'Instalimi': 'Mural, shumë i thjeshtë'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Manuali i Përdorimit JP (Shembull)',
          description: 'Udhëzime për kaldajën JP (PDF, Shembull)',
          url: '/downloads/jp-manual-placeholder.pdf',
          fileSize: '1.7 MB (Shembull)'
        },
        {
          title: 'Broshura Teknike JP (Shembull)',
          description: 'Specifikimet teknike për serinë JP (PDF, Shembull)',
          url: '/downloads/jp-brochure-placeholder.pdf',
          fileSize: '1.1 MB (Shembull)'
        }
      ],
      relatedProducts: ['kalldaja-og', 'kalldaja-mp', 'radiator']
    },
    // Radiatorat
    {
      id: 'radiator',
      title: 'Radiator Panel',
      description: 'Radiator panel çeliku me efikasitet të lartë për shpërndarje të shpejtë dhe uniforme të ngrohjes.',
      price: 'Kontakto',
      image: '/produktet/radiator.png',
      category: 'ngrohje-qendrore',
      subcategory: 'radiator',
      badges: [
        {
          text: 'Ngrohje e Shpejtë',
          bgColor: '#fffbeb',
          textColor: '#f59e0b'
        },
        {
          text: 'Çelik Cilësor',
          bgColor: '#f1f5f9',
          textColor: '#475569'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Materiali',
          value: 'Çelik',
          icon: '/icons/material.svg'
        },
        {
          name: 'Tipi',
          value: 'Panel',
          icon: '/icons/type.svg'
        },
        {
          name: 'Garancia',
          value: '10 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Dimensionet',
          value: 'Të ndryshme',
          icon: '/icons/dimensions.svg'
        }
      ],
      models: [
        {
          id: 'panel-22-600x1000',
          name: 'Panel Çeliku 22/600x1000',
          price: 'Kontakto'
        }
      ],
      features: [
        'Ngrohje e Shpejtë dhe e Barabartë falë dizajnit panel',
        'Materiale të Cilësisë së Lartë - Çelik rezistent ndaj korrozionit',
        'Efiçiencë e Lartë Energjitike - Transferim optimal i nxehtësisë',
        'Dizajn Modern dhe Elegant - Përshtatet me çdo ambient',
        'Gama e gjerë e dimensioneve dhe tipeve (Tip 11, 21, 22, 33)',
        'Instalim i lehtë'
      ],
      longDescription: `
        <p>Radiatorët panel prej çeliku janë zgjidhja klasike dhe efikase për sistemet e ngrohjes qendrore. Ata ofrojnë shpërndarje të shpejtë dhe uniforme të nxehtësisë në të gjithë hapësirën.</p>
        
        <p>Të prodhuar nga çelik i cilësisë së lartë dhe të lyer me bojë rezistente, këta radiatorë janë të qëndrueshëm dhe kanë jetëgjatësi të lartë. Disponueshëm në një larmi të madhe madhësish dhe tipesh për t'iu përshtatur çdo nevoje.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK/Partner (Shembull)',
        'Materiali': 'Çelik',
        'Lyerja': 'Bojë pluhur RAL 9016 (Shembull)',
        'Presioni maksimal': '10 bar (Shembull)',
        'Temperatura maksimale': '110°C (Shembull)',
        'Garancia': '10 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu i Radiatorëve Panel (Shembull)',
          description: 'Dimensionet dhe fuqitë termike (PDF, Shembull)',
          url: '/downloads/radiator-panel-catalog-placeholder.pdf',
          fileSize: '3.0 MB (Shembull)'
        }
      ],
      relatedProducts: ['radiator-gypor', 'kalldaja-og', 'pompa-nxehtesie-vanguard']
    },
    {
      id: 'radiator-gypor',
      title: 'Radiator Gypor',
      description: 'Radiator alumini gypor me dizajn elegant dhe transferim të shkëlqyer të nxehtësisë.',
      price: 'Kontakto',
      image: '/produktet/radiator-gypor.png',
      category: 'ngrohje-qendrore',
      subcategory: 'radiator',
      badges: [
        {
          text: 'Alumini',
          bgColor: '#e2e8f0',
          textColor: '#334155'
        },
        {
          text: 'Dizajn Elegant',
          bgColor: '#fce7f3',
          textColor: '#db2777'
        },
        {
          text: 'Efikasitet i Lartë',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Materiali',
          value: 'Alumini',
          icon: '/icons/material.svg'
        },
        {
          name: 'Tipi',
          value: 'Gypor (Elementë)',
          icon: '/icons/type.svg'
        },
        {
          name: 'Garancia',
          value: '10 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Ngrohje',
          value: 'Konveksion + Rrezatim',
          icon: '/icons/heat.svg'
        }
      ],
      models: [
        {
          id: 'gypor-h600',
          name: 'Gypor H600 (për element)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Ngrohje e Shpejtë dhe e Barabartë falë aluminit',
        'Materiale të Cilësisë së Lartë - Alumin rezistent',
        'Efiçiencë e Lartë Energjitike - Transferim i shkëlqyer termik',
        'Dizajn Modern dhe Elegant - Përshtatet me interierët bashkëkohorë',
        'Modular - Mundësi konfigurimi sipas nevojës (numri i elementëve)',
        'Pesha e lehtë krahasuar me radiatorët e çelikut'
      ],
      longDescription: `
        <p>Radiatorët gypor prej alumini kombinojnë estetikën moderne me performancën e lartë të ngrohjes. Materiali i aluminit lejon ngrohje shumë të shpejtë dhe transferim efikas të nxehtësisë në ambient.</p>
        
        <p>Dizajni me elementë lejon krijimin e radiatorëve me madhësi të personalizuar për çdo hapësirë. Zgjedhja ideale për ata që kërkojnë një zgjidhje ngrohjeje elegante dhe efikase.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK/Partner (Shembull)',
        'Materiali': 'Alumini i Presuar',
        'Lyerja': 'Bojë pluhur RAL 9016 (Shembull)',
        'Presioni maksimal': '6 bar (Shembull)',
        'Temperatura maksimale': '110°C (Shembull)',
        'Garancia': '10 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu i Radiatorëve Gypor (Shembull)',
          description: 'Të dhëna teknike dhe fuqitë (PDF, Shembull)',
          url: '/downloads/radiator-gypor-catalog-placeholder.pdf',
          fileSize: '2.5 MB (Shembull)'
        }
      ],
      relatedProducts: ['radiator', 'kalldaja-mp', 'pompa-nxehtesie-serene']
    },
    // Fancoilerat
    {
      id: 'fancoiler',
      title: 'Fancoiler ECOTEK',
      description: 'Fancoiler mural me dizajn modern për ngrohje dhe ftohje efikase dhe të qetë.',
      price: 'Kontakto',
      image: '/produktet/fancoiler.png',
      category: 'ngrohje-qendrore',
      subcategory: 'fancoiler',
      badges: [
        {
          text: 'Ngrohje & Ftohje',
          bgColor: '#ccfbf1',
          textColor: '#14b8a6'
        },
        {
          text: 'I Qetë',
          bgColor: '#f5f3ff',
          textColor: '#7c3aed'
        },
        {
          text: 'Dizajn Modern',
          bgColor: '#fce7f3',
          textColor: '#db2777'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Funksioni',
          value: 'Ngrohje/Ftohje',
          icon: '/icons/climate.svg'
        },
        {
          name: 'Montimi',
          value: 'Mural',
          icon: '/icons/wall.svg'
        },
        {
          name: 'Garancia',
          value: '2 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Zhurma',
          value: 'E ulët',
          icon: '/icons/noise.svg'
        }
      ],
      models: [
        {
          id: 'fancoil-mural-3kw',
          name: 'Fancoil Mural (3kW)',
          price: 'Kontakto'
        },
        {
          id: 'fancoil-mural-6kw',
          name: 'Fancoil Mural (6kW)',
          price: 'Kontakto'
        }
      ],
      features: [
       'Efiçiencë Energjitike në ngrohje dhe ftohje',
        'Materiale të Cilësisë së Lartë dhe dizajn modern',
        'Funksionim i Heshtur falë ventilatorit tangjencial',
        'Kontroll i Saktë i Temperaturës dhe shpejtësisë së ventilatorit',
        'Kapacitete nga 3kW deri në 6kW',
        'Telekomandë infra të kuqe (opsionale)',
        'Instalim i lehtë në mur'
      ],
      longDescription: `
        <p>Fancoiler-at muralë ECOTEK ofrojnë një zgjidhje elegante dhe efikase për klimatizimin e hapësirave rezidenciale dhe komerciale. Ata mund të përdoren si për ngrohje (në kombinim me pompa termike ose kaldaja) ashtu edhe për ftohje.</p>
        
        <p>Dizajni modern dhe operimi i qetë i bëjnë të përshtatshëm për çdo ambient. Kontrolli i avancuar lejon rregullim të saktë të temperaturës dhe komoditetit.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Fancoiler Mural',
        'Funksioni': 'Ngrohje / Ftohje',
        'Kontrolli': 'Panel kontrolli i integruar / Telekomandë (opsion)',
        'Garancia': '2 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu Fancoiler Mural (Shembull)',
          description: 'Të dhëna teknike dhe performanca (PDF, Shembull)',
          url: '/downloads/fancoil-mural-catalog-placeholder.pdf',
          fileSize: '2.8 MB (Shembull)'
        }
      ],
      relatedProducts: ['fancoiler-kasetor', 'pompa-nxehtesie-serene', 'kalldaja-og']
    },
    {
      id: 'fancoiler-kasetor',
      title: 'Fancoiler Kasetor',
      description: 'Fancoiler kasetor për montim në tavan, ideal për shpërndarje uniforme të ajrit në 4 drejtime.',
      price: 'Kontakto',
      image: '/produktet/fancoiler-kasetor.png',
      category: 'ngrohje-qendrore',
      subcategory: 'fancoiler',
      badges: [
        {
          text: 'Ngrohje & Ftohje',
          bgColor: '#ccfbf1',
          textColor: '#14b8a6'
        },
        {
          text: 'Montim Tavan',
          bgColor: '#f0f9ff',
          textColor: '#0284c7'
        },
        {
          text: 'Shpërndarje 4D',
          bgColor: '#fafafa',
          textColor: '#71717a'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Funksioni',
          value: 'Ngrohje/Ftohje',
          icon: '/icons/climate.svg'
        },
        {
          name: 'Montimi',
          value: 'Kasetor (Tavan)',
          icon: '/icons/ceiling.svg'
        },
        {
          name: 'Garancia',
          value: '2 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Kapaciteti',
          value: '3kW - 12kW',
          icon: '/icons/power.svg'
        }
      ],
      models: [
        {
          id: 'kasetor-600x600-5kw',
          name: 'Kasetor 600x600 (5kW)',
          price: 'Kontakto'
        },
        {
          id: 'kasetor-840x840-12kw',
          name: 'Kasetor 840x840 (12kW)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Efiçiencë Energjitike në ngrohje dhe ftohje',
        'Materiale të Cilësisë së Lartë',
        'Funksionim i Heshtur',
        'Kontroll i Saktë i Temperaturës',
        'Kapacitete nga 3kW deri në 12kW',
        'Shpërndarje ajri në 4 drejtime për komfort maksimal',
        'Pompë kondensate e integruar (në shumicën e modeleve)',
        'Panel dekorativ estetik'
      ],
      longDescription: `
        <p>Fancoiler-at kasetorë janë zgjidhja diskrete dhe efikase për klimatizimin e zyrave, dyqaneve dhe hapësirave të tjera komerciale ose rezidenciale me tavane të varur. Montimi në tavan dhe shpërndarja e ajrit në 4 drejtime sigurojnë një ambient uniform dhe komod.</p>
        
        <p>Me kapacitete të ndryshme dhe operim të qetë, fancoiler-at kasetorë ECOTEK integrohen lehtësisht në çdo dizajn interieri duke ofruar performancë të lartë.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Fancoiler Kasetor',
        'Funksioni': 'Ngrohje / Ftohje',
        'Montimi': 'Në tavan të varur',
        'Garancia': '2 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu Fancoiler Kasetor (Shembull)',
          description: 'Të dhëna teknike dhe dimensionet (PDF, Shembull)',
          url: '/downloads/fancoil-kasetor-catalog-placeholder.pdf',
          fileSize: '3.2 MB (Shembull)'
        }
      ],
      relatedProducts: ['fancoiler', 'pompa-nxehtesie-maxi', 'kalldaja-mp']
    },
    // Akumuluesit
    {
      id: 'akumulues',
      title: 'Akumulues ECOTEK',
      description: 'Akumulues uji inoksi për sisteme solare dhe ngrohje qendrore.',
      price: 'Kontakto',
      image: '/produktet/akumulues.png',
      category: 'ngrohje-solare',
      subcategory: 'akumulues',
      badges: [
        {
          text: 'Inoksi AISI 316L',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Solar & Ngrohje',
          bgColor: '#fef3c7',
          textColor: '#b45309'
        },
        {
          text: 'Garanci 5 Vite',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Kapaciteti',
          value: '60 Litra',
          icon: '/icons/capacity.svg'
        },
        {
          name: 'Materiali',
          value: 'Inoksi 316L',
          icon: '/icons/material.svg'
        },
        {
          name: 'Garancia',
          value: '5 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Presioni',
          value: '6 bar (Shembull)',
          icon: '/icons/pressure.svg'
        }
      ],
      models: [
        {
          id: 'akumulues-60l',
          name: 'Akumulues 60L',
          price: '150'
        },
        {
          id: 'akumulues-100l',
          name: 'Akumulues 100L',
          price: '200'
        },        
        {
          id: 'akumulues-200l',
          name: 'Akumulues 200L',
          price: '350'
        }
      ],
      features: [
        'Kapaciteti 60 Litra',
        'Materiali Inoksi AISI 316L - Jetëgjatësi maksimale dhe higjienë',
        'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjitike',
        'Mundësi me 1 ose 2 Serpentina (solar + kaldajë)',
        'Rezistencë Elektrike Opsionale',
        'Mbrojtje Anodike Magnezi',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Akumuluesit e ujit ECOTEK janë projektuar për të ruajtur ujin e ngrohtë sanitar të prodhuar nga sistemet solare ose burime të tjera ngrohjeje (p.sh., kaldaja, pompa termike). Ky model 60-litërsh është ideal për apartamente ose familje të vogla.</p>
        
        <p>Ndërtuar nga inoksi AISI 316L dhe i izoluar me poliuretan të dendur, ai siguron efikasitet të lartë dhe ujë të pastër për përdorim sanitar. Disponohet me një ose dy serpentina shtesë për fleksibilitet maksimal në integrimin me sisteme të ndryshme.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Akumulues Uji Sanitar',
        'Materiali i Brendshëm': 'Inoksi AISI 316L',
        'Izolimi': 'Poliuretan (50mm - Shembull)',
        'Garancia': '5 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu Akumulues Inoksi (Shembull)',
          description: 'Të dhëna teknike për serinë e akumuluesve (PDF, Shembull)',
          url: '/downloads/akumulues-inox-catalog-placeholder.pdf',
          fileSize: '2.2 MB (Shembull)'
        }
      ],
      relatedProducts: ['akumulues-80l', 'akumulues-120l', 'kolektor-solar']
    },
    // Boilerat
    {
      id: 'boiler-spiral',
      title: 'Boiler Me Spirale',
      description: 'Boiler me spirale për ujë të ngrohtë sanitar me cilësi të lartë dhe efikasitet maksimal.',
      price: 'Kontakto',
      image: '/produktet/boiler-spiral.png',
      category: 'sanitari',
      subcategory: 'bojler',
      badges: [
        {
          text: 'Inoksi AISI 316L',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Uji i Ngrohtë Sanitar',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        },
        {
          text: 'Garanci 5 Vite',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Kapaciteti',
          value: '150L-300L',
          icon: '/icons/capacity.svg'
        },
        {
          name: 'Materiali',
          value: 'Inoksi 316L',
          icon: '/icons/material.svg'
        },
        {
          name: 'Garancia',
          value: '5 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Presioni',
          value: '6 bar (Shembull)',
          icon: '/icons/pressure.svg'
        }
      ],
      models: [
        {
          id: 'bojler-spiral-150l',
          name: 'Bojler Me Spirale 150L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-spiral-200l',
          name: 'Bojler Me Spirale 200L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-spiral-300l',
          name: 'Bojler Me Spirale 300L',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti nga 50 Litra deri në 200 Litra',
        'Materiali Inoksi AISI 316L - Jetëgjatësi maksimale dhe higjienë',
        'Izolim me Poliuretan me Densitet të Lartë - Humbje minimale nxehtësie',
        'Mundësi me rezistencë elektrike për ngrohje të menjëhershme',
        'Mbrojtje Anodike Magnezi',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Bojlerët inoks ECOTEK janë projektuar për të ofruar ujë të ngrohtë sanitar me cilësi të lartë dhe efikasitet maksimal. Me kapacitete nga 50 Litra deri në 200 Litra, ata janë të përshtatshëm për familje të vogla dhe të mëdha.</p>
        
        <p>Ndërtuar nga inoksi AISI 316L dhe i izoluar me poliuretan të dendur, këta bojlerë sigurojnë efikasitet të lartë dhe ujë të pastër për përdorim sanitar.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Bojler Uji Sanitar',
        'Materiali i Brendshëm': 'Inoksi AISI 316L',
        'Izolimi': 'Poliuretan (50mm - Shembull)',
        'Garancia': '5 vite (Shembull)'
      },
      specifications: {
      },
      downloads: [
        {
          title: 'Katalogu Bojler Inoksi (Shembull)',
          description: 'Të dhëna teknike për serinë e bojlerëve (PDF, Shembull)',
          url: '/downloads/bojler-inox-catalog-placeholder.pdf',
          fileSize: '2.2 MB (Shembull)'
        }
      ],
      relatedProducts: ['akumulues-150l', 'kolektor-solar', 'pompa-nxehtesie-vanguard']
    },    
    {
      id: 'boiler-ecopump',
      title: 'Boileri ECOPUMP',
      description: 'Boileri ECOPUMP për ngrohje të ngrohtë.',
      price: 'Kontakto',
      image: '/produktet/boiler-ecopump.png', // Placeholder - use relevant image
      category: 'sanitari', // Or adjust category if needed
      subcategory: 'bojler',
      badges: [
        {
          text: 'Akumulim & Ngrohje',
          bgColor: '#e0f2fe', // Example color
          textColor: '#0ea5e9'
        },
        {
          text: 'Izolim Superior',
          bgColor: '#dcfce7', // Example color
          textColor: '#16a34a'
        },
        {
          text: 'Garanci 5 Vite',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Kapaciteti',
          value: '200L-300L', // Example range
          icon: '/icons/capacity.svg'
        },
        {
          name: 'Materiali',
          value: 'Çelik i Emaluar / Inoks (Specify)', // Needs clarification
          icon: '/icons/material.svg'
        },
        {
          name: 'Garancia',
          value: '5 vite (Shembull)',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Serpentina',
          value: 'Opsionale (0, 1, ose 2)', // Often optional or included
          icon: '/icons/coil.svg'
        }
      ],
      models: [
        {
          id: 'bojler-ecopump-200l',
          name: '200L',
          price: '1400'
        },
        {
          id: 'bojler-ecopump-300l',
          name: '300L',
          price: '1600'
        }
      ],
      features: [
        'Kombinon funksionin e bojlerit dhe akumuluesit',
        'Kapacitete të ndryshme (80L, 120L, 200L - Shembull)',
        'Material i brendshëm rezistent (Çelik i emaluar ose Inoks - Specify)',
        'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjitike',
        'Mundësi me 1 ose 2 Serpentina (solar + kaldajë)',
        'Rezistencë Elektrike e integruar',
        'Mbrojtje Anodike Magnezi',
        'Termostat i rregullueshëm',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Bojlerët akumulues ECOTEK ofrojnë një zgjidhje dy-në-një, duke kombinuar funksionin e ngrohjes së ujit me atë të akumulimit për ruajtjen e energjisë. Janë idealë për t\'u integruar me sisteme të ngrohjes qendrore ose solare.</p>
        
        <p>Me izolim superior dhe materiale cilësore, këta bojlerë sigurojnë ujë të ngrohtë sanitar në mënyrë efikase dhe ekonomike. Opsionet me serpentina shtesë lejojnë shfrytëzimin e burimeve alternative të energjisë.</p>
        <p><i>Shënim: Ju lutemi specifikoni materialin e brendshëm (Çelik i emaluar ose Inoks) dhe praninë/numrin e serpentinave për modelet specifike.</i></p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Bojler Akumulues Uji',
        'Materiali i Brendshëm': 'Çelik i Emaluar / Inoks (Specify)',
        'Izolimi': 'Poliuretan (50-60mm - Shembull)',
        'Garancia': '5 vite (Shembull)'
      },
      specifications: {

      },
      downloads: [
        {
          title: 'Katalogu Bojler Akumulues (Shembull)',
          description: 'Të dhëna teknike për serinë e bojlerëve akumulues (PDF, Shembull)',
          url: '/downloads/bojler-akumulues-catalog-placeholder.pdf',
          fileSize: '2.5 MB (Shembull)'
        }
      ],
      relatedProducts: ['bojler-inox', 'akumulues-200l', 'kalldaja-mp', 'pompa-nxehtesie-vanguard']
    },
  ]
}