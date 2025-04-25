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
    // Placeholders added from categories/[id]/data.ts
    {
      id: 'pompa-nxehtesie-vanguard',
      title: 'Pompa Termike Vanguard Comfort',
      description: 'Pompë termike ajër-ujë me efikasitet të lartë për ngrohje dhe ujë të ngrohtë sanitar.',
      price: 'Kontakto',
      image: '/produktet/Vanguard.png',
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
          title: 'Manuali i përdorimit (Shembull)',
          description: 'Udhëzues për përdorimin e Vanguard Comfort (PDF, Shembull)',
          url: '/downloads/vanguard-manual-placeholder.pdf',
          fileSize: '2 MB (Shembull)'
        },
        {
          title: 'Broshura teknike (Shembull)',
          description: 'Specifikimet teknike të detajuara (PDF, Shembull)',
          url: '/downloads/vanguard-brochure-placeholder.pdf',
          fileSize: '1.5 MB (Shembull)'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-apex', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-serene',
      title: 'Pompa Termike Serene Climate',
      description: 'Pompë termike ajër-ujë A+++ me teknologji Inverter dhe ftohës R32.',
      price: 'Kontakto',
      image: '/produktet/Serene.png',
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
        'Teknologji Inverter për kursim energjie',
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

      },
      downloads: [
        {
          title: 'Broshura Serene Climate (Shembull)',
          description: 'Specifikimet teknike dhe veçoritë (PDF, Shembull)',
          url: '/downloads/serene-brochure-placeholder.pdf',
          fileSize: '1.8 MB (Shembull)'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-vanguard', 'pompa-nxehtesie-apex', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-apex',
      title: 'Pompa Termike Apex Heating',
      description: 'Pompë termike ajër-ujë A+++ me ftohës natyral R290 dhe temperaturë të lartë uji (75°C).',
      price: 'Kontakto',
      image: '/produktet/Apex.png',
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
          id: 'apex-15kw',
          name: 'Apex Heating 15kW',
          price: 'Kontakto'
        },
        {
          id: 'apex-22kw',
          name: 'Apex Heating 22kW',
          price: 'Kontakto'
        },
        {
          id: 'apex-32kw',
          name: 'Apex Heating 32kW',
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
      },
      downloads: [
        {
          title: 'Broshura Apex Heating R290 (Shembull)',
          description: 'Specifikimet teknike dhe avantazhet e R290 (PDF, Shembull)',
          url: '/downloads/apex-r290-brochure-placeholder.pdf',
          fileSize: '2.1 MB (Shembull)'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-maxi', 'kalldaja-og']
    },
    {
      id: 'pompa-nxehtesie-maxi',
      title: 'Pompa Termike Split Maxi Comfort',
      description: 'Pompë termike ajër-ujë tip Split A+++ me ftohës R32, ideale për hapësira rezidenciale.',
      price: 'Kontakto',
      image: '/produktet/Maxi.png',
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
          id: 'maxi-6kw',
          name: 'Maxi Comfort Split 6kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-8kw',
          name: 'Maxi Comfort Split 8kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-10kw',
          name: 'Maxi Comfort Split 10kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-12kw',
          name: 'Maxi Comfort Split 12kW',
          price: 'Kontakto'
        },
        {
          id: 'maxi-16kw',
          name: 'Maxi Comfort Split 16kW',
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
      },
      downloads: [
        {
          title: 'Broshura Maxi Comfort Split (Shembull)',
          description: 'Detajet teknike dhe udhëzimet e instalimit (PDF, Shembull)',
          url: '/downloads/maxi-split-brochure-placeholder.pdf',
          fileSize: '2.0 MB (Shembull)'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-serene', 'pompa-nxehtesie-apex', 'pompa-nxehtesie-sinceko']
    },
    {
      id: 'pompa-nxehtesie-sinceko',
      title: 'Pompa Termike Sinceko Split',
      description: 'Pompë termike ajër-ujë tip Split A++ me ftohës R32, zgjidhje ekonomike për ngrohje.',
      price: 'Kontakto',
      image: '/produktet/Sinceko.png',
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
          id: 'sinceko-6kw',
          name: 'Sinceko Split 6kW',
          price: 'Kontakto'
        },
        {
          id: 'sinceko-8kw',
          name: 'Sinceko Split 8kW',
          price: 'Kontakto'
        },
        {
          id: 'sinceko-10kw',
          name: 'Sinceko Split 10kW',
          price: 'Kontakto'
        },
        {
          id: 'sinceko-12kw',
          name: 'Sinceko Split 12kW',
          price: 'Kontakto'
        },
        {
          id: 'sinceko-16kw',
          name: 'Sinceko Split 16kW',
          price: 'Kontakto'
        }
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
      },
      downloads: [
        {
          title: 'Broshura Sinceko Split (Shembull)',
          description: 'Specifikimet teknike bazë (PDF, Shembull)',
          url: '/downloads/sinceko-split-brochure-placeholder.pdf',
          fileSize: '1.5 MB (Shembull)'
        }
      ],
      relatedProducts: ['pompa-nxehtesie-maxi', 'pompa-nxehtesie-apex', 'kalldaja-elektrike']
    },
    {
      id: 'kalldaja-og',
      title: 'Kalldaja me Gaz Kondensuese OG Comfort',
      description: 'Kalldajë murale me gaz kondensuese me efikasitet të lartë për ngrohje dhe ujë të ngrohtë sanitar.',
      price: 'Kontakto',
      image: '/produktet/OG.png',
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
        'Prodhuesi': 'ECOTEK / Partner (Shembull)',
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
      image: '/produktet/MP.png',
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
      image: '/produktet/JP.png',
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
        
        <p>Pavarësisht madhësisë së saj të vogël, JP ofron fuqi të mjaftueshme për të ngrohur apartamente dhe shtëpi të vogla në mënyrë ekonomike.</p>
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
    {
      id: 'radiator',
      title: 'Radiator Panel',
      description: 'Radiator panel çeliku me efikasitet të lartë për shpërndarje të shpejtë dhe uniforme të ngrohjes.',
      price: 'Kontakto',
      image: '/produktet/Radiatori.png',
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
      image: '/produktet/RadiatorGyp.png',
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
    {
      id: 'fancoiler',
      title: 'Fancoiler ECOTEK',
      description: 'Fancoiler mural me dizajn modern për ngrohje dhe ftohje efikase dhe të qetë.',
      price: 'Kontakto',
      image: '/produktet/fancoilera.png',
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
      image: '/produktet/kasetor.png',
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
    {
      id: 'akumulues-60l',
      title: 'Akumulues ECOTEK 60L',
      description: 'Akumulues uji inoksi 60 litra për sisteme solare dhe ngrohje qendrore.',
      price: 'Kontakto',
      image: '/produktet/Akumulues1.png',
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
          id: 'akumulues-60l-1s',
          name: 'Akumulues 60L (1 Serpentinë)',
          price: 'Kontakto'
        },
        {
          id: 'akumulues-60l-2s',
          name: 'Akumulues 60L (2 Serpentina)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti 60 Litra',
        'Materiali Inoksi AISI 316L - Jetëgjatësi maksimale dhe higjienë',
        'Izolim me Poliuretan me Densitet të Lartë - Humbje minimale nxehtësie',
        'Mundësi me 1 ose 2 Serpentina (solar + kaldajë)',
        'Rezistencë Elektrike Opsionale',
        'Mbrojtje Anodike Magnezi',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Akumuluesit e ujit ECOTEK janë projektuar për të ruajtur ujin e ngrohtë sanitar të prodhuar nga sistemet solare ose burime të tjera ngrohjeje (p.sh., kaldaja, pompa termike). Ky model 60-litërsh është ideal për apartamente ose familje të vogla.</p>
        
        <p>Ndërtuar nga inoksi AISI 316L dhe i izoluar me poliuretan të dendur, ai siguron efikasitet të lartë dhe ujë të pastër për përdorim sanitar. Disponohet me një ose dy serpentina për fleksibilitet maksimal në integrimin me sisteme të ndryshme.</p>
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
    {
      id: 'akumulues-80l',
      title: 'Akumulues ECOTEK 80L',
      description: 'Akumulues uji inoksi 80 litra, efikas dhe i qëndrueshëm për ujë të ngrohtë sanitar.',
      price: 'Kontakto',
      image: '/produktet/Akumulues1.png',
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
          value: '80 Litra',
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
          name: 'Serpentina',
          value: '1 ose 2',
          icon: '/icons/coil.svg'
        }
      ],
      models: [
        {
          id: 'akumulues-80l-1s',
          name: 'Akumulues 80L (1 Serpentinë)',
          price: 'Kontakto'
        },
        {
          id: 'akumulues-80l-2s',
          name: 'Akumulues 80L (2 Serpentina)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti 80 Litra - Përshtatshëm për familje të vogla/mesme',
        'Materiali Inoksi AISI 316L',
        'Izolim me Poliuretan me Densitet të Lartë',
        'Mundësi me 1 ose 2 Serpentina',
        'Rezistencë Elektrike Opsionale',
        'Mbrojtje Anodike Magnezi',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Modeli 80-litërsh i akumuluesve ECOTEK ofron një zgjidhje të balancuar midis kapacitetit dhe madhësisë, duke e bërë ideal për shumicën e aplikimeve rezidenciale.</p>
        
        <p>Ashtu si modelet e tjera, është i ndërtuar me inoks të cilësisë së lartë AISI 316L dhe izolim superior për efikasitet maksimal dhe jetëgjatësi. Zgjedhja me një ose dy serpentina lejon integrim të lehtë me sistemin tuaj solar dhe/ose ngrohjes qendrore.</p>
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
      relatedProducts: ['akumulues-60l', 'akumulues-120l', 'kolektor-solar-premium']
    },
    {
      id: 'akumulues-120l',
      title: 'Akumulues ECOTEK 120L',
      description: 'Akumulues uji inoksi 120 litra me kapacitet të shtuar për familje mesatare.',
      price: 'Kontakto',
      image: '/produktet/Akumulues1.png',
      category: 'ngrohje-solare',
      subcategory: 'akumulues',
      badges: [
        {
          text: 'Inoksi AISI 316L',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Kapacitet i Shtuar',
          bgColor: '#eef2ff',
          textColor: '#4f46e5'
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
          value: '120 Litra',
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
          name: 'Serpentina',
          value: '1 ose 2',
          icon: '/icons/coil.svg'
        }
      ],
      models: [
        {
          id: 'akumulues-120l-1s',
          name: 'Akumulues 120L (1 Serpentinë)',
          price: 'Kontakto'
        },
        {
          id: 'akumulues-120l-2s',
          name: 'Akumulues 120L (2 Serpentina)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti 120 Litra - Ideale për familje me 3-4 persona',
        'Materiali Inoksi AISI 316L',
        'Izolim me Poliuretan me Densitet të Lartë',
        'Mundësi me 1 ose 2 Serpentina',
        'Rezistencë Elektrike Opsionale',
        'Mbrojtje Anodike Magnezi',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Me një kapacitet prej 120 litrash, ky akumulues ECOTEK është perfekt për familjet mesatare, duke siguruar sasi të mjaftueshme uji të ngrohtë sanitar.</p>
        
        <p>Si të gjithë akumuluesit tanë inoks, ai ofron cilësi të lartë ndërtimi, izolim efikas dhe fleksibilitet në instalim falë opsioneve me një ose dy serpentina.</p>
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
      relatedProducts: ['akumulues-80l', 'akumulues-150l', 'kolektor-solar']
    },
    {
      id: 'akumulues-150l',
      title: 'Akumulues ECOTEK 150L',
      description: 'Akumulues uji inoksi 150 litra me kapacitet të lartë për familje të mëdha ose kërkesa të larta.',
      price: 'Kontakto',
      image: '/produktet/Akumulues1.png',
      category: 'ngrohje-solare',
      subcategory: 'akumulues',
      badges: [
        {
          text: 'Inoksi AISI 316L',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Kapacitet i Lartë',
          bgColor: '#fef3c7',
          textColor: '#d97706'
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
          value: '150 Litra',
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
          name: 'Serpentina',
          value: '1 ose 2',
          icon: '/icons/coil.svg'
        }
      ],
      models: [
        {
          id: 'akumulues-150l-1s',
          name: 'Akumulues 150L (1 Serpentinë)',
          price: 'Kontakto'
        },
        {
          id: 'akumulues-150l-2s',
          name: 'Akumulues 150L (2 Serpentina)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti 150 Litra - Për familje të mëdha ose përdorim intensiv',
        'Materiali Premium Inoksi AISI 316L',
        'Izolim efikas me Poliuretan me Densitet të Lartë',
        'Mundësi me 1 ose 2 Serpentina për fleksibilitet instalimi',
        'Rezistencë Elektrike Opsionale me fuqi të lartë',
        'Mbrojtje Anodike Magnezi kundër korrozionit',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Akumuluesi ECOTEK 150-litërsh është zgjidhja ideale për familjet e mëdha ose për situata ku kërkohet një volum i madh uji të ngrohtë sanitar.</p>
        
        <p>Ndërtuar me standardet më të larta, duke përdorur inoks AISI 316L dhe izolim me densitet të lartë, ky model garanton performancë të qëndrueshme dhe kursim energjie. Disponueshmëria me një ose dy serpentina e bën të përshtatshëm për integrim me sisteme të ndryshme ngrohjeje.</p>
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
      relatedProducts: ['akumulues-120l', 'akumulues-200l', 'kolektor-solar-premium']
    },
    {
      id: 'akumulues-200l',
      title: 'Akumulues ECOTEK 200L',
      description: 'Akumulues uji inoksi 200 litra me kapacitet maksimal për nevojat më të mëdha.',
      price: 'Kontakto',
      image: '/produktet/Akumulues1.png',
      category: 'ngrohje-solare',
      subcategory: 'akumulues',
      badges: [
        {
          text: 'Inoksi AISI 316L',
          bgColor: '#e0f2fe',
          textColor: '#0ea5e9'
        },
        {
          text: 'Kapacitet Maksimal',
          bgColor: '#fef3c7',
          textColor: '#d97706'
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
          value: '200 Litra',
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
          name: 'Serpentina',
          value: '1 ose 2',
          icon: '/icons/coil.svg'
        }
      ],
      models: [
        {
          id: 'akumulues-200l-1s',
          name: 'Akumulues 200L (1 Serpentinë)',
          price: 'Kontakto'
        },
        {
          id: 'akumulues-200l-2s',
          name: 'Akumulues 200L (2 Serpentina)',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kapaciteti 200 Litra - Për nevojat më të mëdha dhe aplikime komerciale të vogla',
        'Materiali Premium Inoksi AISI 316L',
        'Izolim superior me Poliuretan me Densitet të Lartë',
        'Mundësi me 1 ose 2 Serpentina për çdo sistem',
        'Rezistencë Elektrike Opsionale me fuqi të lartë',
        'Mbrojtje Anodike Magnezi e dyfishtë (Shembull)',
        'Garanci 5 vite (Shembull)'
      ],
      longDescription: `
        <p>Modeli 200-litërsh i akumuluesve ECOTEK përfaqëson kapacitetin maksimal në serinë tonë standarde, i projektuar për të përmbushur kërkesat më të larta për ujë të ngrohtë sanitar, si në rezidenca të mëdha ashtu edhe në aplikime komerciale të vogla.</p>
        
        <p>Cilësia e ndërtimit me inoks AISI 316L, izolimi i avancuar dhe fleksibiliteti i konfigurimit me serpentina e bëjnë atë një investim afatgjatë dhe të besueshëm për sistemin tuaj të ngrohjes.</p>
      `,
      details: {
        'Prodhuesi': 'ECOTEK (Shembull)',
        'Tipi': 'Akumulues Uji Sanitar',
        'Materiali i Brendshëm': 'Inoksi AISI 316L',
        'Izolimi': 'Poliuretan (60mm - Shembull)', 
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
      relatedProducts: ['akumulues-150l', 'kolektor-solar', 'pompa-nxehtesie-vanguard']
    },
    {
      id: 'bojler-inox',
      title: 'Bojler Inoksi ECOTEK',
      description: 'Bojler inoksi për ujë të ngrohtë sanitar me cilësi të lartë dhe efikasitet maksimal.',
      price: 'Kontakto',
      image: '/produktet/Bojler-Inoksi.png',
      category: 'ngrohje-solare',
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
          value: '50 Litra - 200 Litra',
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
          id: 'bojler-inox-50l',
          name: 'Bojler Inoksi 50L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-inox-100l',
          name: 'Bojler Inoksi 100L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-inox-200l',
          name: 'Bojler Inoksi 200L',
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
      id: 'bojler-akumulues',
      title: 'Bojler Akumulues ECOTEK',
      description: 'Bojler elektrik akumulues me izolim të lartë dhe kapacitete të ndryshme, ideal për kombinim me sisteme ngrohje.',
      price: 'Kontakto',
      image: '/produktet/Bojler-Akumulues.png', // Placeholder - use relevant image
      category: 'ngrohje-solare', // Or adjust category if needed
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
          value: '80 Litra - 200 Litra', // Example range
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
          id: 'bojler-akumulues-80l',
          name: 'Bojler Akumulues 80L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-akumulues-120l',
          name: 'Bojler Akumulues 120L',
          price: 'Kontakto'
        },
        {
          id: 'bojler-akumulues-200l',
          name: 'Bojler Akumulues 200L',
          price: 'Kontakto'
        }
      ],
      features: [
        'Kombinon funksionin e bojlerit dhe akumuluesit',
        'Kapacitete të ndryshme (80L, 120L, 200L - Shembull)',
        'Material i brendshëm rezistent (Çelik i emaluar ose Inoks - Specify)',
        'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjetike',
        'Mundësi me 1 ose 2 Serpentina për lidhje me kaldaja ose panele solare',
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
    }
  ];
}
