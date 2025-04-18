import { Product } from '@/app/categories/[id]/data';

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
    // Ngrohje Qendrore - Pompa Termike
    {
      id: 'pompa-nxehtesie-ecotherm',
      title: 'EcoTek Heat Pump Pro',
      description: 'Pompë termike me efikasitet të lartë energjetik, ideale për ngrohje dhe ftohje.',
      price: "1200",
      image: '/images/products/heat-pump-1.jpg',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      features: [
        'Efikasitet energjetik A+++',
        'Funksionim i qetë (nën 40dB)',
        'Kontroll inteligjent me WiFi',
        'Dizajn modern dhe kompakt',
        'Instalim i thjeshtë'
      ],
      details: {
        'Fuqia': '9kW',
        'Efikasiteti': 'A+++',
        'Niveli i zhurmës': '38dB',
        'Garancia': '5 vite'
      },
      specifications: {
        'Dimensionet': '800 x 600 x 300 mm',
        'Pesha': '45 kg',
        'Temperatura e punës': '-20°C deri +43°C',
        'Gazi ftohës': 'R32 (ekologjik)',
        'Tensioni': '220-240V / 50Hz',
        'Konsumi maksimal': '2.8 kW'
      },
      relatedProducts: ['pompa-termike-eco-2', 'kalldaja-elektrike-1']
    },
    {
      id: 'pompa-termike-eco-2',
      title: 'EcoTek Heat Pump Compact',
      description: 'Pompë termike kompakte për apartamente dhe shtëpi të vogla, me instalim të thjeshtë.',
      price: "950",
      image: '/images/products/heat-pump-2.jpg',
      category: 'ngrohje-qendrore',
      subcategory: 'pompa-termike',
      features: [
        'Efikasitet energjetik A++',
        'Dizajn ultra-kompakt',
        'Kontroll me smartphone',
        'Funksionim i qetë',
        'Instalim pa nevojë për punime të mëdha'
      ],
      details: {
        'Fuqia': '6kW',
        'Efikasiteti': 'A++',
        'Niveli i zhurmës': '42dB',
        'Garancia': '3 vite'
      },
      specifications: {
        'Dimensionet': '700 x 500 x 250 mm',
        'Pesha': '32 kg',
        'Temperatura e punës': '-15°C deri +43°C',
        'Gazi ftohës': 'R32 (ekologjik)',
        'Tensioni': '220-240V / 50Hz',
        'Konsumi maksimal': '1.9 kW'
      },
      relatedProducts: ['pompa-termike-eco-1', 'kalldaja-elektrike-1']
    },
    
    // Ngrohje Qendrore - Kalldaja Elektrike
    {
      id: 'kalldaja-elektrike-1',
      title: 'EcoTek Electric Boiler 12kW',
      description: 'Kalldajë elektrike moderne me efikasitet të lartë dhe kontroll të saktë të temperaturës.',
      price: "780",
      image: '/images/products/electric-boiler-1.jpg',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja-elektrike',
      features: [
        'Fuqi 12kW me rregullim automatik',
        'Panel dixhital me prekje',
        'Instalim i thjeshtë në mur',
        'Trup prej çeliku inox',
        'Termostat i saktë dixhital'
      ],
      details: {
        'Fuqia': '12kW',
        'Efikasiteti': 'A+',
        'Kontrolli': 'Dixhital',
        'Garancia': '3 vite'
      },
      specifications: {
        'Dimensionet': '740 x 440 x 240 mm',
        'Pesha': '25 kg',
        'Temperatura e punës': '30°C deri 85°C',
        'Presioni maksimal': '3 bar',
        'Tensioni': '380-400V / 50Hz',
        'Lidhjet': '3/4 inch'
      },
      relatedProducts: ['kalldaja-elektrike-2', 'pompa-termike-eco-1']
    },
    {
      id: 'kalldaja-elektrike-2',
      title: 'EcoTek Electric Boiler 18kW',
      description: 'Kalldajë elektrike me fuqi të lartë për hapësira të mëdha, me kontroll inteligjent të energjisë.',
      price: "980",
      image: '/images/products/electric-boiler-2.jpg',
      category: 'ngrohje-qendrore',
      subcategory: 'kalldaja-elektrike',
      features: [
        'Fuqi 18kW me rregullim automatik',
        'Kontroll inteligjent i konsumit',
        'Lidhje me sistemin e menaxhimit të shtëpisë',
        'Trup prej çeliku inox me izolim të avancuar',
        'Funksion anti-ngrirje'
      ],
      details: {
        'Fuqia': '18kW',
        'Efikasiteti': 'A+',
        'Kontrolli': 'Smart',
        'Garancia': '5 vite'
      },
      specifications: {
        'Dimensionet': '840 x 480 x 260 mm',
        'Pesha': '32 kg',
        'Temperatura e punës': '30°C deri 85°C',
        'Presioni maksimal': '3 bar',
        'Tensioni': '380-400V / 50Hz',
        'Lidhjet': '3/4 inch'
      },
      relatedProducts: ['kalldaja-elektrike-1', 'pompa-termike-eco-2']
    },
    
    // Klimatizim & Ventilim - Kondicioner
    {
      id: 'kondicioner-inverter-1',
      title: 'EcoTek Inverter AC 12000BTU',
      description: 'Kondicioner me teknologji inverter, efikas dhe i qetë për ftohje dhe ngrohje.',
      price: "650",
      image: '/images/products/air-conditioner-1.jpg',
      category: 'klimatizim-ventilim',
      subcategory: 'kondicioner',
      features: [
        'Teknologji inverter për kursim energjie',
        'Funksion ftohje dhe ngrohje',
        'Filtër antibakterial',
        'Telekomandë me ekran LCD',
        'Funksionim i qetë natën'
      ],
      details: {
        'Kapaciteti': '12000 BTU',
        'Efikasiteti': 'A++',
        'Niveli i zhurmës': '21dB',
        'Garancia': '3 vite'
      },
      specifications: {
        'Dimensionet e brendshme': '850 x 290 x 200 mm',
        'Dimensionet e jashtme': '720 x 540 x 260 mm',
        'Pesha e brendshme': '9 kg',
        'Pesha e jashtme': '28 kg',
        'Gazi ftohës': 'R32 (ekologjik)',
        'Tensioni': '220-240V / 50Hz',
        'Konsumi maksimal': '1.2 kW'
      },
      relatedProducts: ['kondicioner-inverter-2', 'ventilator-1']
    },
    {
      id: 'kondicioner-inverter-2',
      title: 'EcoTek Inverter AC 18000BTU',
      description: 'Kondicioner i fuqishëm me teknologji inverter për hapësira të mëdha, me kontroll WiFi.',
      price: "850",
      image: '/images/products/air-conditioner-2.jpg',
      category: 'klimatizim-ventilim',
      subcategory: 'kondicioner',
      features: [
        'Kapacitet i lartë 18000 BTU',
        'Teknologji inverter për kursim energjie',
        'Kontroll me WiFi dhe smartphone',
        'Filtër HEPA dhe jonizues',
        'Diagnostikim automatik i problemeve'
      ],
      details: {
        'Kapaciteti': '18000 BTU',
        'Efikasiteti': 'A+++',
        'Niveli i zhurmës': '24dB',
        'Garancia': '5 vite'
      },
      specifications: {
        'Dimensionet e brendshme': '1050 x 320 x 230 mm',
        'Dimensionet e jashtme': '820 x 580 x 320 mm',
        'Pesha e brendshme': '12 kg',
        'Pesha e jashtme': '36 kg',
        'Gazi ftohës': 'R32 (ekologjik)',
        'Tensioni': '220-240V / 50Hz',
        'Konsumi maksimal': '1.7 kW'
      },
      relatedProducts: ['kondicioner-inverter-1', 'ventilator-1']
    },
    
    // Sanitari - Rubineta
    {
      id: 'rubineta-kuzhine-1',
      title: 'EcoTek Kitchen Faucet Pro',
      description: 'Rubinetë moderne për kuzhinë me spërkatës të nxjerrshëm dhe rrotullim 360 gradë.',
      price: "120",
      image: '/images/products/faucet-1.jpg',
      category: 'sanitari',
      subcategory: 'rubineta',
      features: [
        'Dizajn elegant prej çeliku inox',
        'Spërkatës i nxjerrshëm',
        'Rrotullim 360 gradë',
        'Kartuç qeramik për jetëgjatësi',
        'Instalim i thjeshtë'
      ],
      details: {
        'Materiali': 'Çelik inox',
        'Përfundimi': 'I lëmuar',
        'Stili': 'Modern',
        'Garancia': '5 vite'
      },
      specifications: {
        'Lartësia': '400 mm',
        'Gjatësia e tubit': '150 cm',
        'Presioni i rekomanduar': '1-5 bar',
        'Temperatura maksimale': '90°C',
        'Lidhjet': '3/8 inch'
      },
      relatedProducts: ['rubineta-kuzhine-2', 'rubineta-banjo-1']
    },
    {
      id: 'rubineta-banjo-1',
      title: 'EcoTek Bathroom Faucet Elegance',
      description: 'Rubinetë elegante për banjo me kursim uji dhe përfundim anti-njollë.',
      price: "90",
      image: '/images/products/faucet-2.jpg',
      category: 'sanitari',
      subcategory: 'rubineta',
      features: [
        'Dizajn elegant dhe modern',
        'Teknologji për kursim uji',
        'Përfundim anti-njollë',
        'Kartuç qeramik për jetëgjatësi',
        'Instalim i thjeshtë'
      ],
      details: {
        'Materiali': 'Tunxh me veshje kromi',
        'Përfundimi': 'Krom i lëmuar',
        'Stili': 'Modern',
        'Garancia': '3 vite'
      },
      specifications: {
        'Lartësia': '160 mm',
        'Presioni i rekomanduar': '1-5 bar',
        'Temperatura maksimale': '90°C',
        'Lidhjet': '3/8 inch'
      },
      relatedProducts: ['rubineta-kuzhine-1', 'rubineta-banjo-2']
    }
  ];
}
