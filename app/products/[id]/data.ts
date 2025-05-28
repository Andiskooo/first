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
  imageUrl: string;
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
      price: '2450 - 5500',
      imageUrl: '/produktet/pompa-termike-vanguard.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A++ Eficencë',
          bgColor: '#e7f9ed',
          textColor: '#18a757'
        },
        {
          text: 'R32 Gaz',
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
          value: '4 vite',
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
          price: '3500'
        },
        {
          id: 'vanguard-24',
          name: 'Vanguard-24kW',
          price: '4500'
        },
        {
          id: 'vanguard-32',
          name: 'Vanguard-32kW',
          price: '5500'
        }
      ],
      features: [ 
        'Energy Efficiency Class A++, Ngrohje dhe Ftohje',
        'R32 Gaz - Më ekologjik dhe efikas',
        'Inverter Technology - Për kursim energjie dhe operim të qetë',
        'Temperaturë e lartë uji deri në 55°C',
        'Disponueshme në kapacitete 12kW, 18kW, 24kW, 32kW',
        'Kontroll i avancuar dixhital',
        'Certifikimet: ISO9001, CE, Etiketa e Energjisë erP, ROHS'
      ],
      longDescription: `
        <p>Pompa Termike EcoTek “Vanguard Comfort”</p><p>Pompat Termike EcoTek Vanguard Comfort me kompresor të gazit R32 janë projektuar për të sjellë komoditet në jetën e njerëzve me ujë të nxehtë, ngrohje dhe ftohje. Karakteristikat e punës së pompës termike dhe funksionet e krahasueshme përfshijnë vlerësimin e energjisë ERP A++, operacionin me zhurmë të ulët 55 Db, gazin R32, kontrollin inteligjent dhe shkrirjen “defrost” inteligjente. Përveç kësaj, këto pompa të ngrohjes me inverter të teknologjis së fundit për të reduktuar kostot efektive përdoren me anë të ekranit touch screen 5-inch. Pompa termike funksionon deri në temperaturën e ulët -25°C EVI dhe funksionimin e softuerit në distancë me një klikim të programit telefonik.</p>
      `,      specifications: {
        // Data structured as: Characteristic -> Model -> Value
        'Model No.': {
          'vanguard-12': 'BLN-012TA1',
          'vanguard-18': 'BLN-018TA1',
          'vanguard-24': 'BLN-026TA1',
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
          'vanguard-12': 'R32',
          'vanguard-18': 'R32',
          'vanguard-24': 'R32',
          'vanguard-32': 'R32'
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
      price: '3100 - 4950',
      imageUrl: '/produktet/pompa-termike-serene.png', 
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A+++ Efiçencë',
          bgColor: '#e7f9ed', // Green
          textColor: '#18a757'
        },
        {
          text: 'R32 Gaz',
          bgColor: '#e5f6fd', // Blue
          textColor: '#0284c7'
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
          value: '10kW - 24kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 55°C',
          icon: '/icons/temperature.svg'
        },
        {
          name: 'Gaz',
          value: 'R32',
          icon: '/icons/refrigerant.svg'
        }
      ],
      models: [
        {
          id: 'serene-10kw',
          name: 'Serene Climate 10kW',
          price: '3100'
        },
        {
          id: 'serene-15kw',
          name: 'Serene Climate 15kW',
          price: '3600'
        },
        {
          id: 'serene-18kw',
          name: 'Serene Climate 18kW',
          price: '3950'
        },
        {
          id: 'serene-24kw',
          name: 'Serene Climate 24kW',
          price: '4950'
        }
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A+++, Ngrohje dhe Ftohje',
        'Gaz ekologjik R32',
        'Teknologji Inverter për kursim energjie',
        'Temperaturë maksimale e ujit 55°C',
        'Pompë qarkullimi e integruar',
        'Enë ekspansioni e integruar',
        'Valvula sigurie të integruara',
        'Operim i qetë',
        'Kontroll inteligjent'
      ],
      longDescription: `
<p>Pompa e Ngrohjes Serene Climate R32 ka një dizajn modern dhe vlerësim A+++. Ajo përdor gazin miqësor për mjedisin R32 dhe teknologjinë inverter, duke siguruar ujë deri në 55°C me konsum të ulët energjie dhe performancë të lartë. Pajisja vjen e kompletuar me:</p>
<p>Pompë qarkulluese të integruar për shpërndarje të barabartë të ngrohjes dhe ftohjes,</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R32',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '4 vite'
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
      description: 'Pompë termike ajër-ujë A+++ me Gaz natyral R290 dhe temperaturë të lartë ujit dalës (75°C).',
      price: '3000 - 5050',
      imageUrl: '/produktet/pompa-termike-apex.png',
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
          text: 'Temperatura Ujit 75°C',
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
          value: '6kW - 18kW',
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
          price: '2950'
        },
        {
          id: 'apex-12kw-monophase',
          name: 'Apex Heating 12kW Monofazë',
          price: '4000'
        },        
        {
          id: 'apex-12kw-triphase',
          name: 'Apex Heating 12kW Trifazë',
          price: '4100'
        },
        {
          id: 'apex-18kw-monophase',
          name: 'Apex Heating 18kW Monofazë',
          price: '4950'
        },
        {
          id: 'apex-18kw-triphase',
          name: 'Apex Heating 18kW Trifazë',
          price: '5050'
        }   // Add other capacities if applicable
      ],
      features: [
        'Klasa më e lartë e Efikasitetit Energjetik A+++',
        'Gaz natyral R290 me GWP (Potencial Ngrohje Globale) shumë të ulët',
        'Teknologji Inverter për përshtatje të fuqisë dhe kursim maksimal',
        'Temperaturë e lartë e daljes së ujit deri në 75°C, ideale për radiatorë ekzistues',
        'Pompë qarkullimi e integruar me efikasitet të lartë',
        'Enë ekspansioni e integruar',
        'Valvula sigurie dhe komponentë hidraulikë të integruar',
        'Operim shumë i qetë',
        'Kontroll inteligjent me mundësi WiFi',
        'Kapacitete: 6kW deri 18kW'
      ],
      longDescription: `
        <p>Apex Heating përfaqëson majën e teknologjisë së pompave termike, duke përdorur gazin natyral R290 (Propan) për një ndikim minimal mjedisor dhe efikasitet të jashtëzakonshëm A+++.</p>
        
        <p>Karakteristika kryesore e kësaj pompe është aftësia për të prodhuar ujë me temperaturë deri në 75°C, duke e bërë të përshtatshme për zëvendësimin e kaldajave të vjetra në sisteme me radiatorë tradicionalë, pa pasur nevojë për ndryshime në sistemin egzistues.</p>

        <p>Përfshin komponentë hidraulikë të integruar për instalim të lehtë dhe ofron operim të besueshëm edhe në temperatura të ulëta të ambientit.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Pompë Termike Ajër-Ujë (Temp. Lartë)',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R290 (Propan)',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '4 vite'
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
      title: 'Pompa Termike Maxi Afariste',
      description: 'Pompë termike ajër-ujë A++ me Gaz R410a, ideale për hapësira komerciale ose afariste.',
      price: '12,000 - 25,000',
      imageUrl: '/produktet/pompa-termike-maxi.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A++ Efiçencë',
          bgColor: '#e7f9ed', // Green
          textColor: '#18a757'
        },
        {
          text: 'R410a Gaz',
          bgColor: '#e5f6fd', // Blue
          textColor: '#0284c7'
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
          value: '40kW - 350kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 55°C',
          icon: '/icons/temperature.svg' // Adjust temp if needed
        },
        {
          name: 'Tipi',
          value: 'Afariste',
          icon: '/icons/split-type.svg' // Assuming an icon exists
        }
      ],
      models: [
        {
          id: 'maxi-50kw',
          name: 'Maxi Afariste 50kW',
          price: 'Kontakto për'
        },
        {
          id: 'maxi-100kw',
          name: 'Maxi Afariste 100kW',
          price: 'Kontakto për'
        },
        {
          id: 'maxi-200kw',
          name: 'Maxi Afariste 200kW',
          price: 'Kontakto për'
        },
        {
          id: 'maxi-400kw',
          name: 'Maxi Afariste 400kW',
          price: 'Kontakto për'
        }
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A++',
        'Gaz ekologjik R410a',
        'Teknologji Inverter DC për modulim të vazhdueshëm',
        'Temperaturë maksimale e ujit 55°C',
        'Operim i qetë si për njësinë e jashtme',
        'Kontroll inteligjent me ekran LCD dhe mundësi WiFi',
        'Mbrojtje nga ngrirja',
        'Kapacitete të ndryshme: 50kW, 100kW, 200kW, 400kW'
      ],
      longDescription: `
<p>Seria e Pumpave të Ngrohjes dhe Ftohjes Komerciale Maxi nga EcoTek duke përdorur gazin e ftohjes R410a, ofron avantazhe të shumta. R410a është miqësor për mjedisin, pa ndikim potencial në ozon, duke zvogëluar ndikimin e tij. Ai ofron vetitë termodinamike të përmirësuara, duke rezultuar në efikasitet të lartë të energjisë dhe zvogëlim të kostove operative. Mundësia e shkëlqyer e transferimit të nxehtësisë të gazit lejon performancë optimale në ngrohje dhe ftohje. Mundësia e tij për të operuar në presione më të larta lejon dizajne sistemi më kompakte.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Pompë Termike Ajër-Ujë',
        'Teknologjia': 'Inverter DC',
        'Ftohësi': 'R410a',
        'Klasa e Energjisë': 'A++',
        'Garancia': '4 vite'
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
      title: 'Pompa Gjeotermike Sinceko',
      description: 'Pompë Gjeotermike ujë-ujë A+++ me Gaz R410a, zgjidhje ekonomike për ngrohje.',
      price: '1950 - 5850',
      imageUrl: '/produktet/pompa-gjeotermike-sinceko.png',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      badges: [
        {
          text: 'A+++ Efiçencë',
          bgColor: '#f0fdf4', // Lighter Green
          textColor: '#16a34a'
        },
        {
          text: 'R410a Ftohës',
          bgColor: '#e5f6fd', // Blue
          textColor: '#0284c7'
        },
        {
          text: 'Tip Gjeotermal',
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
          value: '12kW - 55kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Temperatura Ujit',
          value: 'Deri në 55°C',
          icon: '/icons/temperature.svg' // Adjust temp if needed
        },
        {
          name: 'Tipi',
          value: 'Gjeotermike',
          icon: '/icons/split-type.svg'
        }
      ],
      models: [
        {
          id: 'sinceko-30kw',
          name: 'Sinceko 30kW',
          price: '4500'
        },
      ],
      features: [
        'Klasa e Efikasitetit Energjetik A+++',
        'Gaz ekologjik R410a',
        'Teknologji Inverter për funksionim efikas',
        'Temperaturë maksimale e ujit 55°C',
        'Operim i besueshëm dhe ekonomik',
        'Kontrollues i thjeshtë dhe intuitiv'
      ],
      longDescription: `
        <p>Sinceko Ground Source “Uj-Uj</p>
<p>Pompa e Ngrohjes nga Burimet e Tokës SINCEKO ofron një zgjidhje të gjithëpërfshirëse, të miqësueshme ndaj mjedisit dhe të kursyer për energjinë për ngrohjen, ftohjen dhe ujin e nxehtë shtëpiake. Përveç dy avantazheve kryesore të energjisë së lartë dhe zhurmës së ulët, kontrolluesi inteligjent i pompa e ngrohjes nga burimet e tokës SINCEKO gjithashtu ofron funksionin e kurvës së ngrohjes për të bërë ngrohjen më të rehatshme dhe funksionin EKO që përfshin tre mënyra për të përshtatur zakonet e ndryshme të jetës familjare për të arritur qëllimin më të madh të kursyerjes së energjisë.</p>
      `,
      details: {
        'Prodhuesi': 'Sinceko (Shembull)',
        'Tipi': 'Pompë Termike Ujë-Ujë Split',
        'Teknologjia': 'Inverter',
        'Ftohësi': 'R410a',
        'Klasa e Energjisë': 'A+++',
        'Garancia': '4 vite'
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
      title: 'Kalldaja Elektrike OG Comfort',
      description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
      price: '250-390',
      imageUrl: '/produktet/kalldaja-og.jpg',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja',
      badges: [
        {
          text: 'Elektrike',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        },
        {
          text: 'Efikase',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Sigurtë',
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
          name: 'Kapaciteti',
          value: '6kW - 27kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Elektriciteti',
          value: '380v / 50hz',
          icon: '/icons/gas.svg' // Assuming icon exists
        },
        {
          name: 'Tipi',
          value: 'OG, Pumpë',
          icon: '/icons/wall-mounted.svg' // Assuming icon exists
        }
      ],
      models: [
        {
          id: 'og-digitale-6kw-9kw',
          name: 'OG Digitale 6kW - 9kW',
          price: '300'
        },
        {
          id: 'og-manuale-6kw-9kw',
          name: 'OG Manuale 6kW - 9kW',
          price: '260'
        },
        {
          id: 'og-digitale-12kw-18kw',
          name: 'OG Digitale 12kW - 18kW',
          price: '370'
        },
        {
          id: 'og-manuale-12kw-18kw',
          name: 'OG Manuale 12kW - 18kW',
          price: '330'
        },
        {
          id: 'og-digitale-21kw-27kw',
          name: 'OG Digitale 21kW - 27kW',
          price: '390'
        },
        {
          id: 'og-manuale-21kw-27kw',
          name: 'OG Manuale 21kW - 27kW',
          price: '350'
        },      
      ],
      features: [
        '2 Modele, Digitale dhe Manuale',
        'Pompe Qarkulluese Tisea',
        'Ekran Touchscreen me Programim Javor apo Sistem Analog',
        'Temperatura Maksimale deri në 90°C',
        'Zhurme nen 55dB',
        'Instalim i thjeshte',
        'Kapacitet nga 6kW - 27kW'
      ],
      longDescription: `
        <p>Kalldaja Elektrike nga firma ECOTEK,</p>
        <p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>
        
        <p>1. Mbrojtje nga Uji</p>
        <p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>
        
        <p>2. Mbrojtje nga Mbirryma</p>
        <p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>
        
        <p>3. Kontaktor Silent</p>
        <p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>
        
        <p>4. Lidhje me WiFi</p>
        <p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Kalldajë Originale',
        'Karburanti': 'Elektrtike',
        'Klasa e Energjisë (Ngrohje)': 'A',
        'Garancia': '2 vite'
      },
      specifications: {

      },
      downloads: [
      ],
      relatedProducts: ['kalldaja-elektrike', 'pompa-nxehtesie-apex', 'radiator']
    },
    {
      id: 'kalldaja-mp',
      title: 'Kalldaja Elektrike MP Comfort',
      description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
      price: '250-390',
      imageUrl: '/produktet/kalldaja-mp.png',  
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja',
      badges: [
        {
          text: 'Elektrike',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        },
        {
          text: 'Efikase',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Sigurtë',
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
          name: 'Kapaciteti',
          value: '6kW - 27kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Elektriciteti',
          value: '380v / 50hz',
          icon: '/icons/gas.svg' // Assuming icon exists
        },
        {
          name: 'Tipi',
          value: 'MP, Pumpë',
          icon: '/icons/wall-mounted.svg' // Assuming icon exists
        }
      ],
      models: [
        {
          id: 'mp-digitale-6kw-9kw',
          name: 'MP Digitale 6kW - 9kW',
          price: '300'
        },
        {
          id: 'mp-manuale-6kw-9kw',
          name: 'MP Manuale 6kW - 9kW',
          price: '260'
        },
        {
          id: 'mp-digitale-12kw-18kw',
          name: 'MP Digitale 12kW - 18kW',
          price: '370'
        },
        {
          id: 'mp-manuale-12kw-18kw',
          name: 'MP Manuale 12kW - 18kW',
          price: '330'
        },
        {
          id: 'mp-digitale-21kw-27kw',
          name: 'MP Digitale 21kW - 27kW',
          price: '390'
        },
        {
          id: 'mp-manuale-21kw-27kw',
          name: 'MP Manuale 21kW - 27kW',
          price: '350'
        },
      ],
      features: [
        '2 Modele, Digitale dhe Manuale',
        'Pompe Qarkulluese Tisea',
        'Ekran Touchscreen me Programim Javor apo Sistem Analog',
        'Temperatura Maksimale deri në 90°C',
        'Zhurme nen 55dB',
        'Instalim i thjeshte',
        'Kapacitet nga 6kW - 27kW'
      ],
      longDescription: `
        <p>Kalldaja Elektrike nga firma ECOTEK,</p>
        <p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>
        
        <p>1. Mbrojtje nga Uji</p>
        <p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>
        
        <p>2. Mbrojtje nga Mbirryma</p>
        <p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>
        
        <p>3. Kontaktor Silent</p>
        <p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>
        
        <p>4. Lidhje me WiFi</p>
        <p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Kalldajë Originale',
        'Karburanti': 'Elektrtike',
        'Klasa e Energjisë (Ngrohje)': 'A',
        'Garancia': '2 vite'
      },
      specifications: {

      },
      downloads: [
      ],
      relatedProducts: ['kalldaja-og', 'kalldaja-jp', 'radiator-gypor']
    },
    {
      id: 'kalldaja-jp',
      title: 'Kalldaja Elektrike ECOTEK JP',
      description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
      price: '250-390',
      imageUrl: '/produktet/kalldaja-jp.png',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja',
      badges: [
        {
          text: 'Elektrike',
          bgColor: '#fef3c7', // Yellow
          textColor: '#b45309'
        },
        {
          text: 'Efikase',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Sigurtë',
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
          name: 'Kapaciteti',
          value: '6kW - 27kW',
          icon: '/icons/power.svg'
        },
        {
          name: 'Elektriciteti',
          value: '380v / 50hz',
          icon: '/icons/gas.svg' // Assuming icon exists
        },
        {
          name: 'Tipi',
          value: 'JP, Pumpë',
          icon: '/icons/wall-mounted.svg' // Assuming icon exists
        }
      ],
      models: [
        {
          id: 'jp-digitale-6kw-9kw',
          name: 'JP Digitale 6kW - 9kW',
          price: '300'
        },
        {
          id: 'jp-manuale-6kw-9kw',
          name: 'JP Manuale 6kW - 9kW',
          price: '260'
        },
        {
          id: 'jp-digitale-12kw-18kw',
          name: 'JP Digitale 12kW - 18kW',
          price: '370'
        },
        {
          id: 'jp-manuale-12kw-18kw',
          name: 'JP Manuale 12kW - 18kW',
          price: '330'
        },
        {
          id: 'jp-digitale-21kw-27kw',
          name: 'JP Digitale 21kW - 27kW',
          price: '390'
        },
        {
          id: 'jp-manuale-21kw-27kw',
          name: 'JP Manuale 21kW - 27kW',
          price: '350'
        },
      ],
      features: [
        '2 Modele, Digitale dhe Manuale',
        'Pompe Qarkulluese Tisea',
        'Ekran Touchscreen me Programim Javor apo Sistem Analog',
        'Temperatura Maksimale deri në 90°C',
        'Zhurme nen 55dB',
        'Instalim i thjeshte',
        'Kapacitet nga 6kW - 27kW'
      ],
      longDescription: `
        <p>Kalldaja Elektrike nga firma ECOTEK,</p>
        <p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>
        
        <p>1. Mbrojtje nga Uji</p>
        <p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>
        
        <p>2. Mbrojtje nga Mbirryma</p>
        <p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>
        
        <p>3. Kontaktor Silent</p>
        <p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>
        
        <p>4. Lidhje me WiFi</p>
        <p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Kalldajë Originale',
        'Karburanti': 'Elektrtike',
        'Klasa e Energjisë (Ngrohje)': 'A',
        'Garancia': '2 vite'
      },
      specifications: {

      },
      downloads: [
      ],
      relatedProducts: ['kalldaja-og', 'kalldaja-mp', 'radiator']
    },
    // Radiatorat
    {
      id: 'radiator',
      title: 'Radiator Panel',
      description: 'Radiator panel çeliku me efikasitet të lartë për shpërndarje të shpejtë dhe uniforme të ngrohjes.',
      price: '80 - 160',
      imageUrl: '/produktet/radiator.png',
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
        },
        {
          text: 'Panel',
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
          value: 'Dy Fletzor',
          icon: '/icons/type.svg'
        },
        {
          name: 'Garancia',
          value: '4 vite',
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
          price: 'Kontakto për çdo model'
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

      ],
      relatedProducts: ['radiator-gypor', 'kalldaja-og', 'pompa-nxehtesie-vanguard']
    },
    {
      id: 'radiator-gypor',
      title: 'Radiator Gypor',
      description: 'Radiator alumini gypor me dizajn elegant dhe transferim të shkëlqyer të nxehtësisë.',
      price: '60 - 120',
      imageUrl: '/produktet/radiator-gypor.png',
      category: 'ngrohje-qendrore',
      subcategory: 'radiator',
      badges: [
        {
          text: 'Qelik',
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
          value: 'Qelik',
          icon: '/icons/material.svg'
        },
        {
          name: 'Tipi',
          value: 'Gypor',
          icon: '/icons/type.svg'
        },
        {
          name: 'Garancia',
          value: '4 vite',
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
          name: 'Gypor H600',
          price: 'Kontakto për çdo model'
        }
      ],
      features: [
        'Ngrohje e Shpejtë dhe e Barabartë falë qelikut',
        'Materiale të Cilësisë së Lartë - Çelik rezistent',
        'Efiçiencë e Lartë Energjitike - Transferim i shkëlqyer termik',
        'Dizajn Modern dhe Elegant - Përshtatet me interierët bashkëkohorë',
        'Modular - Mundësi konfigurimi sipas nevojës'
      ],
      longDescription: `
        <p>Radiatori gypor është modeli më i njohur për banjo, duke kombinuar dizajnin elegant me efikasitetin e lartë të shpërndarjes së nxehtësisë. Struktura me gypa lejon ngrohjen e ambientit dhe tharjen e peshqirëve njëkohësisht. I ndërtuar nga materiale rezistente ndaj lagështisë, ky radiator përshtatet lehtësisht në çdo hapësirë dhe mund të funksionojë me ngrohje qendrore ose si njësi elektrike.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Materiali': 'Çelik',
        'Lyerja': 'Bojë pluhur RAL 9016',
        'Presioni maksimal': '6 bar',
        'Temperatura maksimale': '110°C',
        'Garancia': '4 vite'
      },
      specifications: {

      },
      downloads: [

      ],
      relatedProducts: ['radiator', 'kalldaja-mp', 'pompa-nxehtesie-serene']
    },
    // Fancoilerat
    {
      id: 'fancoiler',
      title: 'Fancoiler Slim ECOTEK',
      description: 'Fancoiler mural me dizajn modern për ngrohje dhe ftohje efikase dhe të qetë.',
      price: '250 - 300',
      imageUrl: '/produktet/fancoiler.png',
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
          value: '30-50 dB',
          icon: '/icons/noise.svg'
        }
      ],
      models: [
        {
          id: 'fancoil-1500W',
          name: 'Fancoil 1500W',
          price: '250'
        },
        {
          id: 'fancoil-2500W',
          name: 'Fancoil 2500W',
          price: '300'
        },
        {
          id: 'fancoil-5650W',
          name: 'Fancoil 5650W',
          price: '350'
        }
      ],
      features: [
       'Efiçiencë Energjitike në ngrohje dhe ftohje',
        'Materiale të Cilësisë së Lartë dhe dizajn modern',
        'Funksionim i Heshtur falë ventilatorit tangjencial',
        'Kontroll i Saktë i Temperaturës dhe shpejtësisë së ventilatorit',
        'Kapacitete nga 1.5kW deri në 5.65kW',
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
        'Model': {
          'fancoil-1500W': 'YG-10',
          'fancoil-2500W': 'YG-20',
          'fancoil-5650W': 'YG-30'
        },
        'Voltage range (V,50/60Hz)': {
          'fancoil-1500W': 'AC190-250V',
          'fancoil-2500W': 'AC190-250V',
          'fancoil-5650W': 'AC190-250V'
        },
        'Range of rotation (rpm)': {
          'fancoil-1500W': '200-2200',
          'fancoil-2500W': '200-2200',
          'fancoil-5650W': '200-2200'
        },
        'Air volume range (m³/h)': {
          'fancoil-1500W': '265',
          'fancoil-2500W': '420',
          'fancoil-5650W': '630'
        },
        'Noise range (dB)': {
          'fancoil-1500W': '34',
          'fancoil-2500W': '37',
          'fancoil-5650W': '39'
        },
        'Cooling Ca. (kW)(Water in 7°C)': {
          'fancoil-1500W': '900W',
          'fancoil-2500W': '1680W',
          'fancoil-5650W': '3360W'
        },
        'Heating Ca. (kW)(Water in 45°C)': {
          'fancoil-1500W': '990W',
          'fancoil-2500W': '1830W',
          'fancoil-5650W': '3450W'
        },
        'Heating Ca. (kW)(Water in 60°C)': {
          'fancoil-1500W': '1560W',
          'fancoil-2500W': '3000W',
          'fancoil-5650W': '5650W'
        },
        'Net weight (Kg)': {
          'fancoil-1500W': '15.3',
          'fancoil-2500W': '17.9',
          'fancoil-5650W': '23.3'
        },
        'Gross weight (Kg)': {
          'fancoil-1500W': '18',
          'fancoil-2500W': '20.7',
          'fancoil-5650W': '26.8'
        },
        'Product Size (L*W*H) (mm)': {
          'fancoil-1500W': '760*130*575',
          'fancoil-2500W': '950*130*575',
          'fancoil-5650W': '1220*130*575'
        },
        'Package Size (L*W*H) (mm)': {
          'fancoil-1500W': '820*185*670',
          'fancoil-2500W': '1010*185*670',
          'fancoil-5650W': '1290*185*670'
        }
      },
      downloads: [
        {
          title: 'Manuali i Përdorimit Fancoiler ',
          description: 'Të dhëna teknike dhe performanca (PDF)',
          url: '/downloads/fancoiler-manual.pdf',
          fileSize: '2.8 MB'
        }
      ],
      relatedProducts: ['fancoiler-kasetor', 'pompa-nxehtesie-serene', 'kalldaja-og']
    },
    {
      id: 'fancoiler-kasetor',
      title: 'Fancoiler Kasetor',
      description: 'Fancoiler kasetor për montim në tavan, ideal për shpërndarje uniforme të ajrit në 4 drejtime.',
      price: '500 - 1200',
      imageUrl: '/produktet/fancoiler-kasetor.png',
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
          value: '2 vite',
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
          id: 'kasetor-600x600x3000mm',
          name: 'Kasetor 600x600x3000mm',
          price: 'Kontakto për çdo model'
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
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Fancoiler Kasetor',
        'Funksioni': 'Ngrohje / Ftohje',
        'Montimi': 'Në tavan të varur',
        'Garancia': '2 vite'
      },
      specifications: {
        'Key Selling Points': {
          'kasetor-600x600x3000mm': 'Competitive price/Non-Freon refrigerant'
        },
        'Weight (KG)': {
          'kasetor-600x600x3000mm': '18.45 KG'
        },
        'Brand Name': {
          'kasetor-600x600x3000mm': 'YESNCER or OEM'
        },
        'Model Number': {
          'kasetor-600x600x3000mm': 'FP-34, FP-51, FP-68, FP-85, FP-102, FP-136, FP-170, FP-204, FP-238'
        },
        'Dimension (L*W*H) (mm)': {
          'kasetor-600x600x3000mm': '650x650x300mm'
        },
        'Machinery Test Report': {
          'kasetor-600x600x3000mm': 'Provided'
        },
        'Video outgoing-inspection': {
          'kasetor-600x600x3000mm': 'Provided'
        },
        'Warranty of core components': {
          'kasetor-600x600x3000mm': '3 years'
        },
        'Core Components': {
          'kasetor-600x600x3000mm': 'Motor'
        },
        'Product name': {
          'kasetor-600x600x3000mm': 'Cassette Fan Coil Unit'
        },
        'Air Volume (m³/h)': {
          'kasetor-600x600x3000mm': '340~2380'
        },
        'Power (W)': {
          'kasetor-600x600x3000mm': '34~198'
        },
        'Cooling capacity (kw)': {
          'kasetor-600x600x3000mm': '1.98 ~12.6'
        },
        'Heating capacity (kw)': {
          'kasetor-600x600x3000mm': '2.98 ~18.9'
        },
        'Noise (dB)': {
          'kasetor-600x600x3000mm': '37~52'
        },
        'voltage': {
          'kasetor-600x600x3000mm': '220V/ 50 Hz'
        },
        'Water flow (m³/h)': {
          'kasetor-600x600x3000mm': '0.169~0.94'
        },
        'Water resistance (kPa)': {
          'kasetor-600x600x3000mm': '14~46'
        },
        'Control method': {
          'kasetor-600x600x3000mm': 'Remote control or wired control'
        }
      },
      downloads: [
      ],
      relatedProducts: ['fancoiler', 'pompa-nxehtesie-maxi', 'kalldaja-mp']
    },
    // Akumuluesit
    {
      id: 'akumulues',
      title: 'Akumulues ECOTEK',
      description: 'Akumulues uji inoksi për ngrohje qendrore dhe sisteme solare.',
      price: '150-400',
      imageUrl: '/produktet/akumulues.png',
      category: 'ngrohje-solare',
      subcategory: 'akumulues',
      badges: [
        {
          text: 'Inoksi',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Solar & Ngrohje',
          bgColor: '#fef3c7',
          textColor: '#b45309'
        },
        {
          text: 'Garanci 4 Vite',
          bgColor: '#f0fdf4',
          textColor: '#22c55e'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Kapacitetet',
          value: '60 L, 100 L, 200 L',
          icon: '/icons/capacity.svg'
        },
        {
          name: 'Materiali',
          value: 'Inoksi',
          icon: '/icons/material.svg'
        },
        {
          name: 'Garancia',
          value: '4 vite',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Presioni',
          value: '6 bar',
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
          price: '400'
        }
      ],
      features: [
        'Kapacitetet 60 L, 100 L, 200 L',
        'Materiali Inoksi - Jetëgjatësi maksimale',
        'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjitike',
        'Mundësi me 1 ose 2 Serpentina (solar + pompe termike)',
        'Nxems Elektrik te integruar',
        'Mbrojtje Anodike Magnezi',
        'Garanci 4 vite'
      ],
      longDescription: `
        <p>Akumulues Uji për Ngrohje Qendrore - Për një Temperaturë Konstante dhe Efiçiencë Maksimale
Investoni në akumuluesin tonë të ujit për ngrohje qendrore dhe siguroni një ambient të ngrohtë dhe të rehatshëm gjatë gjithë vitit. Me kapacitete prej 60 L, 100 L, dhe 200 L, akumuluesit tanë janë zgjidhja ideale për të mbajtur temperaturën konstante në sistemin tuaj të ngrohjes qendrore, qoftë për radiatorë, ngrohje dyshemeje apo fan coilers.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Akumulues Uji',
        'Materiali i Brendshëm': 'Inoksi',
        'Izolimi': 'Poliuretan (50mm)',
        'Garancia': '4 vite'
      },
      specifications: {
        'MODEL': {
          'akumulues-60l': 'HWT60L',
          'akumulues-100l': 'HWT100L',
          'akumulues-200l': 'HWT200L'
        },
        'NOMINAL CAPACITY (L)': {
          'akumulues-60l': '60',
          'akumulues-100l': '100L',
          'akumulues-200l': '200L'
        },
        'OUTLET TANK DIAMETER (MM)': {
          'akumulues-60l': 'Φ450',
          'akumulues-100l': 'Φ470',
          'akumulues-200l': 'Φ520'
        },
        'INNER TANK DIAMETER (MM)': {
          'akumulues-60l': 'Φ350',
          'akumulues-100l': 'Φ370',
          'akumulues-200l': 'Φ420'
        },
        'TANK HEIGHT (MM)': {
          'akumulues-60l': '950',
          'akumulues-100l': '1115',
          'akumulues-200l': '1545'
        },
        'INNER TANK MATERIAL': {
          'akumulues-60l': 'STAINLESS STEEL SUS304,SUS316L OR DUPLEX STAINLESS STEEL',
          'akumulues-100l': 'STAINLESS STEEL SUS304,SUS316L OR DUPLEX STAINLESS STEEL',
          'akumulues-200l': 'STAINLESS STEEL SUS304,SUS316L OR DUPLEX STAINLESS STEEL'
        },
        'INNER TANK THICKNESS (MM)': {
          'akumulues-60l': '1.2',
          'akumulues-100l': '1.2MM',
          'akumulues-200l': '1.2MM'
        },
        'OUTER SHELL MATERIAL': {
          'akumulues-60l': 'GLAVALIZED STEEL WITH WHITE/SILVER-GREY COLOR PAINTING, THICKNESS 0.5MM',
          'akumulues-100l': 'GLAVALIZED STEEL WITH WHITE/SILVER-GREY COLOR PAINTING, THICKNESS 0.5MM',
          'akumulues-200l': 'GLAVALIZED STEEL WITH WHITE/SILVER-GREY COLOR PAINTING, THICKNESS 0.5MM'
        },
        'WORKING PRESSURE (MPA)': {
          'akumulues-60l': '0.6',
          'akumulues-100l': '0.6MPA',
          'akumulues-200l': '0.6MPA'
        },
        'MAX. PRESSURE (MPA)': {
          'akumulues-60l': '1.0',
          'akumulues-100l': '1.0MPA',
          'akumulues-200l': '1.0MPA'
        },
        'FOAMING INSULATION': {
          'akumulues-60l': 'PU COMBINATION POLYETHER FOAMING, THICKNESS 50MM',
          'akumulues-100l': 'PU COMBINATION POLYETHER FOAMING, THICKNESS 50MM',
          'akumulues-200l': 'PU COMBINATION POLYETHER FOAMING, THICKNESS 50MM'
        },
        'PACKAGE SIZE (mm)': {
          'akumulues-60l': '500/500/1000',
          'akumulues-100l': '535/535/1170',
          'akumulues-200l': '535/535/1600'
        }
      },
      downloads: [
      ],
      relatedProducts: ['akumulues-80l', 'akumulues-120l', 'kolektor-solar']
    },
    // Boilerat
    {
      id: 'boiler-spiral',
      title: 'Boiler Me Spirale',
      description: 'Boiler me spirale për ujë të ngrohtë sanitar me cilësi të lartë dhe efikasitet maksimal.',
      price: '500-700',
      imageUrl: '/produktet/boiler-spiral.png',
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
          text: 'Garanci 4 Vite',
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
          value: '4 vite',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Presioni',
          value: '6 bar',
          icon: '/icons/pressure.svg'
        }
      ],
      models: [
        {
          id: 'bojler-spiral-150l',
          name: 'Bojler Me Spirale 150L',
          price: 'Kontakto për çmimin'
        },
        {
          id: 'bojler-spiral-200l',
          name: 'Bojler Me Spirale 200L',
          price: 'Kontakto për çmimin'
        },
        {
          id: 'bojler-spiral-300l',
          name: 'Bojler Me Spirale 300L',
          price: 'Kontakto për çmimin'
        }
      ],
      features: [
        'Kapaciteti nga 150 Litra deri në 300 Litra',
        'Materiali Inoksi AISI 316L - Jetëgjatësi maksimale dhe higjienë',
        'Izolim me Poliuretan me Densitet të Lartë - Humbje minimale nxehtësie',
        'Mundësi me rezistencë elektrike për ngrohje të menjëhershme',
        'Mbrojtje Anodike Magnezi',
        'Garanci 4 vite'
      ],
      longDescription: `
        <p>Boiler Spiral -  Efikasitet dhe Komoditet për Ujin e Ngrohtë në Shtëpinë Tuaj
Siguroni ujë të ngrohtë të pastër dhe të vazhdueshëm me bojlerët tanë të ujit me kapacitete të ndryshme prej 60 L, 100 L, 200 L, dhe 300 L. Të dizajnuar për të plotësuar nevojat tuaja për ujë sanitar të ngrohtë, bojlerët tanë me ngrohës elektrik janë të përshtatshëm për përdorime të ndryshme në shtëpi, duke ofruar efikasitet dhe komoditet të lartë.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Bojler Me Spirale',
        'Materiali i Brendshëm': 'Inoksi AISI 316L',
        'Izolimi': 'Poliuretan (50mm)',
        'Garancia': '4 vite'
      },
      specifications: {
      },
      downloads: [
      ],
      relatedProducts: ['akumulues-150l', 'kolektor-solar', 'pompa-nxehtesie-vanguard']
    },    
    {
      id: 'boiler-ecopump',
      title: 'Boileri ECOPUMP',
      description: 'Boileri ECOPUMP për ngrohje të ujit efficiente.',
      price: '1400 - 1600',
      imageUrl: '/produktet/boiler-ecopump.png',
      category: 'sanitari',
      subcategory: 'bojler',
      badges: [
        {
          text: 'Ngrohje me Pompe',
          bgColor: '#e0f2fe', // Example color
          textColor: '#0ea5e9'
        },
        {
          text: 'Efikas',
          bgColor: '#dcfce7', // Example color
          textColor: '#16a34a'
        },
        {
          text: 'Garanci 4 Vite',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        }
      ],
      keyCharacteristics: [
        {
          name: 'Kapacitetet',
          value: '200L-300L', // Example range
          icon: '/icons/capacity.svg'
        },
        {
          name: 'Gazi',
          value: 'R290, R134a', // Needs clarification
          icon: '/icons/gas.svg'
        },
        {
          name: 'Garancia',
          value: '4 vite',
          icon: '/icons/warranty.svg'
        },
        {
          name: 'Shpenzimet',
          value: '600 Watt/hr', // Often optional or included
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
        'Ngrohje me Pumpe Termike, Gaz R290/R134a',
        '600 Watt/hr shpenzime',
        'Kapacitete të ndryshme 200L-300L',
        'Display Digitale me Programim',
        'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjitike',
        'Nxehmës Elektrike të integruar',
        'Garanci 4 vite'
      ],
      longDescription: `
        <p>Boiler ECOPUMP - Zgjidhje e Avancuar për Ujë të Ngrohtë Sanitar</p>
        <p>Zbuloni bojlerin tonë të avancuar të ujit me pompë termike të integruar, me kapacitete prej 200 L dhe 300 L. Boileri me pompë termike redukton shpenzimet e energjisë deri në 4 herë më shumë krahasuar me bojlerët klasikë me ngrohës elektrik, që ofron një efikasitet të jashtëzakonshëm dhe kursim të konsiderueshëm të energjisë. Ky bojler inovativ shfrytëzon vetitë e gazit për të rritur temperaturën e ujit, duke siguruar një ngrohje efikase dhe ekonomike, ndryshe nga bojlerët klasikë me ngrohës elektrik.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK',
        'Tipi': 'Bojler Akumulues Uji',
        'Materiali i Brendshëm': 'Çelik i Emaluar / Inoks',
        'Izolimi': 'Poliuretan (50-60mm)',
        'Garancia': '4 vite'
      },
      specifications: {
        'Model': {
          'bojler-ecopump-200l': 'YT-200TA2',
          'bojler-ecopump-300l': 'YT-300TA2'
        },
        'Power Supply': {
          'bojler-ecopump-200l': '220-240V/1/50Hz',
          'bojler-ecopump-300l': '220-240V/1/50Hz'
        },
        'Rated Heating Capacity (kW)': {
          'bojler-ecopump-200l': '2.8',
          'bojler-ecopump-300l': '2.8'
        },
        'Refrigerant': {
          'bojler-ecopump-200l': 'R290',
          'bojler-ecopump-300l': 'R290'
        },
        'Tapping Cycle': {
          'bojler-ecopump-200l': 'L',
          'bojler-ecopump-300l': 'XL'
        },
        'Energy Efficient Class': {
          'bojler-ecopump-200l': 'A+',
          'bojler-ecopump-300l': 'A+'
        },
        'Energy Efficient ηwh (%)': {
          'bojler-ecopump-200l': '145.7',
          'bojler-ecopump-300l': '147.6'
        },
        '**COP (EN16147)': {
          'bojler-ecopump-200l': '3.677',
          'bojler-ecopump-300l': '3.691'
        },
        'Tank Capacity (L)': {
          'bojler-ecopump-200l': '200',
          'bojler-ecopump-300l': '300'
        },
        'Air Flow (m³/h)': {
          'bojler-ecopump-200l': '450',
          'bojler-ecopump-300l': '450'
        },
        'Air Discharge': {
          'bojler-ecopump-200l': 'Vertical',
          'bojler-ecopump-300l': 'Vertical'
        },
        'Air Duct Diameter (mm)': {
          'bojler-ecopump-200l': 'Φ150',
          'bojler-ecopump-300l': 'Φ150'
        },
        'Auxiliary electric heater(kW)': {
          'bojler-ecopump-200l': '2',
          'bojler-ecopump-300l': '2'
        },
        'Default Water Temperature(°C)': {
          'bojler-ecopump-200l': '60',
          'bojler-ecopump-300l': '60'
        },
        'Working Temperature Range(°C)': {
          'bojler-ecopump-200l': '-7°C~43',
          'bojler-ecopump-300l': '-7°C~43'
        },
        'Unpacked Dimension (mm)': {
          'bojler-ecopump-200l': 'Φ620*1650',
          'bojler-ecopump-300l': 'Φ620*2050'
        },
        'Packed Dimension (L*W*H)(mm)': {
          'bojler-ecopump-200l': '700*700*1755',
          'bojler-ecopump-300l': '700*700*2155'
        },
        'Net Weight(kg)': {
          'bojler-ecopump-200l': '95',
          'bojler-ecopump-300l': '115'
        },
        'Gross Weight(kg)': {
          'bojler-ecopump-200l': '113',
          'bojler-ecopump-300l': '135'
        },
        'Noise (dB(A))': {
          'bojler-ecopump-200l': '48',
          'bojler-ecopump-300l': '48'
        }
      },
      downloads: [
      ],
      relatedProducts: ['bojler-inox', 'akumulues-200l', 'kalldaja-mp', 'pompa-nxehtesie-vanguard']
    },    // Kondicionerat
    {
      id: "kondicioner-aria",
      title: "Candy - Aria Series",
      description: "Kondicioner split me efikasitet të lartë dhe lidhje WiFi.",
      price: "500 - 750",
      imageUrl: "/produktet/kondicioner-aria.png",
      category: "klimatizim-ventilim",
      subcategory: "kondicioner",
      badges: [
        {
          text: 'A+++/A+++ Efikasitet',
          bgColor: '#e7f9ed',
          textColor: '#18a757'
        },
        {
          text: 'WiFi & HoN App',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Garanci 4 vite',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        },
        {
          text: 'Operim i Qetë',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        },
        
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A+++/A+++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '12K-18K BTU',
          icon: '/icons/power.svg'
        },
        {
          name: 'Kontrolli',
          value: 'WiFi',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Origjina',
          value: 'Italia',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Temperatura Operuese',
          value: '-20°C ~ 43°C',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Gaz',
          value: 'R32',
          icon: '/icons/wifi.svg'
        }
      ],
      models: [
        {
          id: 'aria-12k',
          name: 'Aria 12,000 BTU',
          price: '510'
        },
        {
          id: 'aria-18k',
          name: 'Aria 18,000 BTU',
          price: '650'
        }
      ],
      features: [
        "Prodhuesi: Candy",
        "Klasa e Efikasitetit A+++ (Ftohje) / A+++ (Ngrohje)",
        "Kontroll i integruar Wi-Fi përmes aplikacionit HoN",
        "Dizajn modern dhe elegant",
        "Operim i qetë",
        "Kapacitete: 12,000 BTU, 18,000 BTU",
        "SteriClean Teknologjia 56°C"
      ],
      longDescription: "<p>Zbuloni kondicionerin e avancuar Candy modeli Aria, një produkt i jashtëzakonshëm nga brandi me famë italiane Candy. Ky kondicioner inteligjent me kompresor gazi është dizajnuar për të ofruar rehatinë maksimale si në verë ashtu edhe në dimër. Me teknologji të përparuar dhe një sërë funksionesh të zgjuara, Aria është zgjidhja ideale për çdo shtëpi apo zyrë.</p>",
      details: { 'Prodhuesi': 'Candy', 'Tipi': 'Mural Split', 'Garancia': '2 vite (Shembull)' },
      specifications: {
        'Model': {
          'aria-12k': 'CY-12QBIN / CY-12QBOUT',
          'aria-18k': 'CY-18QBIN / CY-18QBOUT'
        },
        'Cooling Capacity Nominal (Min-Max) (Btu/h)': {
          'aria-12k': '10920(2730-12965)',
          'aria-18k': '15015(4430-18420)'
        },
        'Cooling Capacity Nominal (kW)': {
          'aria-12k': '3.2',
          'aria-18k': '4.4'
        },
        'Cooling Capacity Range (MIN-MAX) (kW)': {
          'aria-12k': '3.2(0.8-3.8)',
          'aria-18k': '(1.30-5.40)'
        },
        'Energy Efficiency SEER': {
          'aria-12k': '6.1',
          'aria-18k': '6.30'
        },
        'Energy Efficiency EER': {
          'aria-12k': '3.23',
          'aria-18k': '3.23'
        },
        'Energy Class Cooling': {
          'aria-12k': 'A++',
          'aria-18k': 'A++'
        },
        'Pdesign Capacity Cooling (kW)': {
          'aria-12k': '3.2',
          'aria-18k': '4.80'
        },
        'Power Input Cooling Nominal (kW)': {
          'aria-12k': '0.99',
          'aria-18k': '1.36'
        },
        'Power Input Cooling Range (Min-Max) (kW)': {
          'aria-12k': '(0.3-1.3)',
          'aria-18k': '(0.40-1.90)'
        },
        'Annual Energy Consumption Cooling (KWH/A)': {
          'aria-12k': '184',
          'aria-18k': '267'
        },
        'Operating Limits Cooling Min-Max (°C)': {
          'aria-12k': '-20~43 °C(out)',
          'aria-18k': '-20~43 °C(out)'
        },
        'Heating Capacity Nominal (Min-Max) (Btu/h)': {
          'aria-12k': '11945(2390-13650)',
          'aria-18k': '15695(4430-18420)'
        },
        'Heating Capacity Nominal (kW)': {
          'aria-12k': '3.5',
          'aria-18k': '4.6'
        },
        'Heating Capacity Range (MIN-MAX) (kW)': {
          'aria-12k': '(0.7-4.0)',
          'aria-18k': '(1.30-5.40)'
        },
        'Energy Efficiency SCOP': {
          'aria-12k': '4',
          'aria-18k': '4.00'
        },
        'Energy Efficiency COP (MILD)': {
          'aria-12k': '3.71',
          'aria-18k': '3.71'
        },
        'Energy Efficiency SCOP (WARM/COLD)': {
          'aria-12k': '5.10/-',
          'aria-18k': '5.10/-'
        },
        'Energy Class Heating (MILD/WARM/COLD)': {
          'aria-12k': 'A+/A+++/-',
          'aria-18k': 'A+/A+++/-'
        },
        'Pdesign Capacity Heating (-10°C) (kW)': {
          'aria-12k': '3.0',
          'aria-18k': '3.60'
        },
        'Power Input Heating Nominal (kW)': {
          'aria-12k': '0.943',
          'aria-18k': '1.24'
        },
        'Power Input Heating Range (MIN-MAX) (kW)': {
          'aria-12k': '(0.4-1.6)',
          'aria-18k': '(0.40-1.90)'
        },
        'Annual Energy Consumption Heating (KWH/A)': {
          'aria-12k': '1050',
          'aria-18k': '1260'
        },
        'Operating Limits Heating Min-Max (°C)': {
          'aria-12k': '-20~24 °C(OUT)',
          'aria-18k': '-20~24 °C(OUT)'
        },
        'Power Supply (Ph/V/Hz)': {
          'aria-12k': '1/220~240/50',
          'aria-18k': '1/220~240/50'
        },
        'Power Supply Position': {
          'aria-12k': 'outdoor',
          'aria-18k': 'outdoor'
        },
        'Indoor Net Dimension (W/D/H) (mm)': {
          'aria-12k': '805*292*200',
          'aria-18k': '875/212/304'
        },
        'Indoor Package Dimension (W/D/H) (mm)': {
          'aria-12k': '876*365*272',
          'aria-18k': '945/390/296'
        },
        'Indoor Net/Shipping Weight (kg)': {
          'aria-12k': '8.8/10.9',
          'aria-18k': '10.0/12.0'
        },
        'Indoor Air Flow (Cooling/Heating) Max (m³/h)': {
          'aria-12k': '650/550',
          'aria-18k': '770/810'
        },
        'Indoor Sound Power Level Cooling (Hi) dB(A)': {
          'aria-12k': '59',
          'aria-18k': '60'
        },
        'Indoor Sound Power Level Heating (Hi) dB(A)': {
          'aria-12k': '59',
          'aria-18k': '60'
        },
        'Indoor Sound Pressure Level Cooling (Hi/Mid/Lo/So) dB(A)': {
          'aria-12k': '38/34/29/20',
          'aria-18k': '44/40/35/28'
        },
        'Indoor Sound Pressure Level Heating (Hi/Mid/Lo/So) dB(A)': {
          'aria-12k': '38/34/29/20',
          'aria-18k': '44/40/35/28'
        },
        'Indoor Moisture Removal (L/h)': {
          'aria-12k': '1.4',
          'aria-18k': '2'
        },
        'Outdoor Compressor': {
          'aria-12k': 'HIGHLY',
          'aria-18k': 'SANYO'
        },
        'Outdoor Net Dimension (W/D/H) (mm)': {
          'aria-12k': '700*245*544',
          'aria-18k': '800/280/553'
        },
        'Outdoor Package Dimension (W/D/H) (mm)': {
          'aria-12k': '819*320*592',
          'aria-18k': '902/375/614'
        },
        'Outdoor Net/Shipping Weight (kg)': {
          'aria-12k': '22.0/24.6',
          'aria-18k': '29.2/32.1'
        },
        'Outdoor Air Flow (Cooling/Heating) Max (m³/h)': {
          'aria-12k': '2100',
          'aria-18k': '2200/2200'
        },
        'Outdoor Sound Power Level Hi dB(A)': {
          'aria-12k': '64',
          'aria-18k': '65'
        },
        'Outdoor Sound Pressure Level Hi dB(A)': {
          'aria-12k': '50/51',
          'aria-18k': '54'
        },
        'Outdoor Running Current Max (A)': {
          'aria-12k': '7.30',
          'aria-18k': '8.6'
        },
        'Refrigerant Type': {
          'aria-12k': 'R32',
          'aria-18k': 'R32'
        },
        'Refrigerant Charge (g)': {
          'aria-12k': '510',
          'aria-18k': '780'
        },
        'tCO2': {
          'aria-12k': '0.34',
          'aria-18k': '0.53'
        },
        'Refrigerant Pipe Liquid Side Diameter (mm)': {
          'aria-12k': '6.35',
          'aria-18k': '6.35'
        },
        'Refrigerant Pipe Gas Side Diameter (mm)': {
          'aria-12k': '9.52',
          'aria-18k': '12.7'
        },
        'Refrigerant Pipe Max Pipe Length/Height (m)': {
          'aria-12k': '20/10',
          'aria-18k': '20/15'
        },
        'Refrigerant Pipe Max Pipe Length without Additional Charge (m)': {
          'aria-12k': '5',
          'aria-18k': '7'
        },
        'Refrigerant Pipe Additional Charge (g/m)': {
          'aria-12k': '20',
          'aria-18k': '20'
        }
      },
      downloads: [],
      relatedProducts: ['kondicioner-pura']
    },
    {
      id: "kondicioner-pura",
      title: "Candy - Pura Series",
      description: "Kondicioner split me gamë të gjerë kapacitetesh dhe lidhje WiFi.",
      price: "350 - 750",
      imageUrl: "/produktet/kondicioner-pura.png",
      category: "klimatizim-ventilim",
      subcategory: "kondicioner",
      badges: [
        {
          text: 'A+++/A++ Efikasitet',
          bgColor: '#e7f9ed',
          textColor: '#18a757'
        },
        {
          text: 'WiFi & HoN App',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Garanci 4 vite',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        },
        {
          text: 'Operim i Qetë',
          bgColor: '#fef3c7',
          textColor: '#d97706'
        },
        
      ],
      keyCharacteristics: [
        {
          name: 'Efikasiteti',
          value: 'A+++/A++',
          icon: '/icons/efficiency.svg'
        },
        {
          name: 'Kapaciteti',
          value: '9K-24K BTU',
          icon: '/icons/power.svg'
        },
        {
          name: 'Kontrolli',
          value: 'WiFi',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Origjina',
          value: 'Italia',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Temperatura Operuese',
          value: '-20°C ~ 43°C',
          icon: '/icons/wifi.svg'
        },
        {
          name: 'Gaz',
          value: 'R32',
          icon: '/icons/wifi.svg'
        }
      ],
      models: [
        {
          id: 'pura-9k',
          name: 'Pura 9,000 BTU',
          price: '280'
        },
        {
          id: 'pura-12k',
          name: 'Pura 12,000 BTU',
          price: '350'
        },
        {
          id: 'pura-18k',
          name: 'Pura 18,000 BTU',
          price: '465'
        },
        {
          id: 'pura-24k',
          name: 'Pura 24,000 BTU',
          price: '640'
        }
      ],
      features: [
        "Prodhuesi: Candy",
        "Klasa e Efikasitetit A+++ (Ftohje) / A+++ (Ngrohje)",
        "Kontroll i integruar Wi-Fi përmes aplikacionit HoN",
        "Dizajn modern dhe elegant",
        "Operim i qetë",
        "Kapacitete: 9,000 BTU, 12,000 BTU, 18,000 BTU, 24,000 BTU",
        "SteriClean Teknologjia 56°C"
      ],
      longDescription: "<p>Zbuloni kondicionerin e ri Candy Modeli Pura, një produkt inovativ nga brandi me famë italiane Candy, krijuar për të sjellë një frymë ajri të pastër në shtëpinë tuaj. Me një dizajn modern dhe funksionalitete të avancuara, Pura ofron performancë të shkëlqyer dhe komoditet maksimal gjatë gjithë vitit.</p>",
      details: { 'Prodhuesi': 'Candy', 'Tipi': 'Mural Split', 'Garancia': '4 vite' },
      specifications: {
        'Model': {
          'pura-9k': 'CY-09RAIN / CY-09RAOUT',
          'pura-12k': 'CY-12RAIN / CY-12RAOUT',
          'pura-18k': 'CY-18RAIN / CY-18RAOUT',
          'pura-24k': 'CY-24RAIN / CY-24RAOUT'
        },
        'Cooling Capacity Nominal (Min-Max) (Btu/h)': {
          'pura-9k': '9215(2390-11600)',
          'pura-12k': '10920(2730-12965)',
          'pura-18k': '15015(4430-18420)',
          'pura-24k': '20475(4430-25250)'
        },
        'Cooling Capacity Nominal (kW)': {
          'pura-9k': '2.7',
          'pura-12k': '3.2',
          'pura-18k': '4.4',
          'pura-24k': '6.0'
        },
        'Cooling Capacity Range (MIN-MAX) (kW)': {
          'pura-9k': '2.7(0.7-3.4)',
          'pura-12k': '3.2(0.8-3.8)',
          'pura-18k': '(1.30-5.40)',
          'pura-24k': '(1.30-7.40)'
        },
        'Energy Efficiency SEER': {
          'pura-9k': '6.5',
          'pura-12k': '6.1',
          'pura-18k': '6.30',
          'pura-24k': '6.70'
        },
        'Energy Efficiency EER': {
          'pura-9k': '3.23',
          'pura-12k': '3.23',
          'pura-18k': '3.23',
          'pura-24k': '3.23'
        },
        'Energy Class Cooling': {
          'pura-9k': 'A++',
          'pura-12k': 'A++',
          'pura-18k': 'A++',
          'pura-24k': 'A++'
        },
        'Pdesign Capacity Cooling (kW)': {
          'pura-9k': '2.7',
          'pura-12k': '3.2',
          'pura-18k': '4.80',
          'pura-24k': '6.20'
        },
        'Power Input Cooling Nominal (kW)': {
          'pura-9k': '0.835',
          'pura-12k': '0.99',
          'pura-18k': '1.36',
          'pura-24k': '1.855'
        },
        'Power Input Cooling Range (Min-Max) (kW)': {
          'pura-9k': '(0.3-1.2)',
          'pura-12k': '(0.3-1.3)',
          'pura-18k': '(0.40-1.90)',
          'pura-24k': '(0.40-2.20)'
        },
        'Annual Energy Consumption Cooling (KWH/A)': {
          'pura-9k': '145',
          'pura-12k': '184',
          'pura-18k': '267',
          'pura-24k': '324'
        },
        'Operating Limits Cooling Min-Max (°C)': {
          'pura-9k': '-20~43 °C(out)',
          'pura-12k': '-20~43 °C(out)',
          'pura-18k': '-20~43 °C(out)',
          'pura-24k': '-20~43 °C(out)'
        },
        'Heating Capacity Nominal (Min-Max) (Btu/h)': {
          'pura-9k': '9895(2390-12285)',
          'pura-12k': '11945(2390-13650)',
          'pura-18k': '15695(4430-18420)',
          'pura-24k': '21500(4770-25590)'
        },
        'Heating Capacity Nominal (kW)': {
          'pura-9k': '2.9',
          'pura-12k': '3.5',
          'pura-18k': '4.6',
          'pura-24k': '6.30'
        },
        'Heating Capacity Range (MIN-MAX) (kW)': {
          'pura-9k': '(0.7-3.6)',
          'pura-12k': '(0.7-4.0)',
          'pura-18k': '(1.30-5.40)',
          'pura-24k': '(1.40-7.50)'
        },
        'Energy Efficiency SCOP': {
          'pura-9k': '4.0',
          'pura-12k': '4',
          'pura-18k': '4.00',
          'pura-24k': '4.00'
        },
        'Energy Efficiency COP (MILD)': {
          'pura-9k': '3.71',
          'pura-12k': '3.71',
          'pura-18k': '3.71',
          'pura-24k': '3.71'
        },
        'Energy Efficiency SCOP (WARM/COLD)': {
          'pura-9k': '5.10/-',
          'pura-12k': '5.10/-',
          'pura-18k': '5.10/-',
          'pura-24k': '5.10/-'
        },
        'Energy Class Heating (MILD/WARM/COLD)': {
          'pura-9k': 'A+/A+++/-',
          'pura-12k': 'A+/A+++/-',
          'pura-18k': 'A+/A+++/-',
          'pura-24k': 'A+/A+++/-'
        },
        'Pdesign Capacity Heating (-10°C) (kW)': {
          'pura-9k': '2.6',
          'pura-12k': '3.0',
          'pura-18k': '3.60',
          'pura-24k': '4.60'
        },
        'Power Input Heating Nominal (kW)': {
          'pura-9k': '0.78',
          'pura-12k': '0.943',
          'pura-18k': '1.24',
          'pura-24k': '1.698'
        },
        'Power Input Heating Range (MIN-MAX) (kW)': {
          'pura-9k': '(0.3-1.4)',
          'pura-12k': '(0.4-1.6)',
          'pura-18k': '(0.40-1.90)',
          'pura-24k': '(0.60-2.30)'
        },
        'Annual Energy Consumption Heating (KWH/A)': {
          'pura-9k': '910',
          'pura-12k': '1050',
          'pura-18k': '1260',
          'pura-24k': '1610'
        },
        'Operating Limits Heating Min-Max (°C)': {
          'pura-9k': '-20~24 °C(OUT)',
          'pura-12k': '-20~24 °C(OUT)',
          'pura-18k': '-20~24 °C(OUT)',
          'pura-24k': '-20~24 °C(OUT)'
        },
        'Power Supply (Ph/V/Hz)': {
          'pura-9k': '1/220~240/50',
          'pura-12k': '1/220~240/50',
          'pura-18k': '1/220~240/50',
          'pura-24k': '1/220~240/50'
        },
        'Power Supply Position': {
          'pura-9k': 'outdoor',
          'pura-12k': 'outdoor',
          'pura-18k': 'outdoor',
          'pura-24k': 'outdoor'
        },
        'Indoor Net Dimension (W/D/H) (mm)': {
          'pura-9k': '805*292*199',
          'pura-12k': '805*292*200',
          'pura-18k': '875/212/304',
          'pura-24k': '975/222/318'
        },
        'Indoor Package Dimension (W/D/H) (mm)': {
          'pura-9k': '876*365*272',
          'pura-12k': '876*365*272',
          'pura-18k': '945/390/296',
          'pura-24k': '1050/397/301'
        },
        'Indoor Net/Shipping Weight (kg)': {
          'pura-9k': '8.8/10.9',
          'pura-12k': '8.8/10.9',
          'pura-18k': '10.0/12.0',
          'pura-24k': '11.6/14.4'
        },
        'Indoor Air Flow (Cooling/Heating) Max (m³/h)': {
          'pura-9k': '550/550',
          'pura-12k': '650/550',
          'pura-18k': '770/810',
          'pura-24k': '1100/1000'
        },
        'Indoor Sound Power Level Cooling (Hi) dB(A)': {
          'pura-9k': '57',
          'pura-12k': '59',
          'pura-18k': '60',
          'pura-24k': '64'
        },
        'Indoor Sound Power Level Heating (Hi) dB(A)': {
          'pura-9k': '57',
          'pura-12k': '59',
          'pura-18k': '60',
          'pura-24k': '64'
        },
        'Indoor Sound Pressure Level Cooling (Hi/Mid/Lo/So) dB(A)': {
          'pura-9k': '38/34/29/19',
          'pura-12k': '38/34/29/20',
          'pura-18k': '44/40/35/28',
          'pura-24k': '47/45/37/29'
        },
        'Indoor Sound Pressure Level Heating (Hi/Mid/Lo/So) dB(A)': {
          'pura-9k': '37/33/29/19',
          'pura-12k': '38/34/29/20',
          'pura-18k': '44/40/35/28',
          'pura-24k': '47/45/37/29'
        },
        'Indoor Moisture Removal (L/h)': {
          'pura-9k': '1.2',
          'pura-12k': '1.4',
          'pura-18k': '2',
          'pura-24k': '2.8'
        },
        'Outdoor Compressor': {
          'pura-9k': 'RECHI',
          'pura-12k': 'HIGHLY',
          'pura-18k': 'SANYO',
          'pura-24k': 'HIGHLY'
        },
        'Outdoor Net Dimension (W/D/H) (mm)': {
          'pura-9k': '700*245*544',
          'pura-12k': '700*245*544',
          'pura-18k': '800/280/553',
          'pura-24k': '800/280/553'
        },
        'Outdoor Package Dimension (W/D/H) (mm)': {
          'pura-9k': '819*320*592',
          'pura-12k': '819*320*592',
          'pura-18k': '902/375/614',
          'pura-24k': '902/375/614'
        },
        'Outdoor Net/Shipping Weight (kg)': {
          'pura-9k': '21.5/23.9',
          'pura-12k': '22.0/24.6',
          'pura-18k': '29.2/32.1',
          'pura-24k': '32.7/36.5'
        },
        'Outdoor Air Flow (Cooling/Heating) Max (m³/h)': {
          'pura-9k': '2100',
          'pura-12k': '2100',
          'pura-18k': '2200/2200',
          'pura-24k': '2500/2500'
        },
        'Outdoor Sound Power Level Hi dB(A)': {
          'pura-9k': '62',
          'pura-12k': '64',
          'pura-18k': '65',
          'pura-24k': '68'
        },
        'Outdoor Sound Pressure Level Hi dB(A)': {
          'pura-9k': '49/50',
          'pura-12k': '50/51',
          'pura-18k': '54',
          'pura-24k': '57'
        },
        'Outdoor Running Current Max (A)': {
          'pura-9k': '6.40',
          'pura-12k': '7.30',
          'pura-18k': '8.6',
          'pura-24k': '10.5'
        },
        'Refrigerant Type': {
          'pura-9k': 'R32',
          'pura-12k': 'R32',
          'pura-18k': 'R32',
          'pura-24k': 'R32'
        },
        'Refrigerant Charge (g)': {
          'pura-9k': '510',
          'pura-12k': '510',
          'pura-18k': '780',
          'pura-24k': '900'
        },
        'tCO2': {
          'pura-9k': '0.34',
          'pura-12k': '0.34',
          'pura-18k': '0.53',
          'pura-24k': '0.61'
        },
        'Refrigerant Pipe Liquid Side Diameter (mm)': {
          'pura-9k': '6.35',
          'pura-12k': '6.35',
          'pura-18k': '6.35',
          'pura-24k': '6.35'
        },
        'Refrigerant Pipe Gas Side Diameter (mm)': {
          'pura-9k': '9.52',
          'pura-12k': '9.52',
          'pura-18k': '12.7',
          'pura-24k': '12.7'
        },
        'Refrigerant Pipe Max Pipe Length/Height (m)': {
          'pura-9k': '20/10',
          'pura-12k': '20/10',
          'pura-18k': '20/15',
          'pura-24k': '25/15'
        },
        'Refrigerant Pipe Max Pipe Length without Additional Charge (m)': {
          'pura-9k': '5',
          'pura-12k': '5',
          'pura-18k': '7',
          'pura-24k': '7'
        },
        'Refrigerant Pipe Additional Charge (g/m)': {
          'pura-9k': '20',
          'pura-12k': '20',
          'pura-18k': '20',
          'pura-24k': '20'
        }
      },
      downloads: [],
      relatedProducts: ['kondicioner-aria']
    }
  ]
}