// Blog post data types and mock data
export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fullContent: string; // Added full content parameter
  imageUrl: string;
  date?: string;
  accentColor?: string; // Optional color for accents
  tags?: string[]; // Added tags for categorization
};

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: '01',
    title: 'Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerëve CANDY',
    subtitle: 'Përdorimi i Aplikacionit hOn',
    content: "Lidhni kondicionerin me Wi-Fi përmes aplikacionit hOn dhe kontrolloni pajisjen tuaj nga kudo.",
    tags: ['Këshilla', 'Teknologji', 'Klimatizim'],
    fullContent: '/blog/blogContent/1.md',
    imageUrl: '/blog/Blog-1.jpg',
    accentColor: 'red-600'
  },
  {
    id: '02',
    title: '5 Arsye Pse Kondicioneri Juaj Mban Erë?',
    subtitle: 'Arsyet dhe zgjidhjet e problemit',
    content: "Në këtë artikull do të mësoni disa arsye pse kondicioneri juaj mban këtë erë dhe si mund të zgjidhet kjo çështje.",
    tags: ['Problemet e Zakonshme', 'Mirëmbajtje', 'Klimatizim'],
    fullContent: '/blog/blogContent/2.md',
    imageUrl: '/blog/Blog-2.png',
    accentColor: 'blue-600'
  },
  {
    id: '03',
    title: 'Si janë Pompat e Nxehtësisë Më shumë se 100% Efikase?',
    subtitle: 'Teknologjia e pompës termike',
    content: "Zbuloni pse pompat termike janë zgjidhje efikase për ngrohje dhe si funksionojnë ato.",
    tags: ['Teknologji', 'Efikasitet', 'Ngrohje'],
    fullContent: '/blog/blogContent/3.md',
    imageUrl: '/blog/Blog-3.jpg',
    accentColor: 'green-600'
  },
  {
    id: '04',
    title: 'Si të Zgjidhni një Pompë Nxehtësie?',
    subtitle: 'Çfarë duhet të merrni parasysh para blerjes',
    content: "Si të përcaktoni kapacitetin optimal të pompës termike për shtëpinë tuaj?",
    fullContent: '/blog/blogContent/4.md',
    imageUrl: '/blog/Blog-4.jpg',
    accentColor: 'orange-600'
  },
  {
    id: '05',
    title: 'Si të Zgjidhni Kapacitetin e sakët për Kondicjoner Candy Split?',
    subtitle: 'Faktorët që duhen marrë parasysh për të zgjidhur njësinë e duhur',
    content: "Zgjedhja e kondicionerit të duhur Candy mini split përfshin më shumë sesa thjesht përputhjen e një vlerësimi BTU me madhësinë e dhomës suaj.",
    fullContent: '/blog/blogContent/5.md',
    imageUrl: '/blog/Blog-5.jpg',
    accentColor: 'blue-600'
  },
  {
    id: '06',
    title: 'Çfarë Do të Thotë me të Vërtetë Termi "BTU"?',
    subtitle: 'Guida e Plotë për BTU: Si të Zgjidhni Kondicionerin e Duhur',
    content: "Në këtë artikull, ne do të diskutojmë se çfarë është një BTU, sa BTU ju nevojiten për shtëpinë tuaj.",
    fullContent: '/blog/blogContent/6.md',
    imageUrl: '/blog/Blog-6.jpg',
    accentColor: 'purple-600'
  },
  {
    id: '07',
    title: 'Pse Instalimi Profesional i Klimës është më i rëndësishëm se Marka që zgjidhni!',
    subtitle: 'Kostot e fsheta nga instalimi jo profesjonal i klimës ',
    content: "Kondicioneri juaj i ri nuk do t'ju ngrohë këtë dimër nëse nuk instalohet si duhet. Mësoni si të mbroni investimin tuaj!",
    fullContent: '/blog/blogContent/7.md',
    imageUrl: '/blog/Blog-7.jpg',
    accentColor: 'black-400'
  },
  {
    id: '08',
    title: 'Si Funksionon Sistemi i Pompës Termike për Ngrohje Qëndrore dhe Ujë të Nxehtë',
    subtitle: 'Si një Valvul Tre-Kahëorshe Mundëson Përdorimin e Dyfishtë të Pompës Tuaj Termike',
    content: "Përdorimi i Dyfishtë: Si Një Pompë Termike Ngroh Shtëpinë dhe Ujin Sanitar Tuaj!",
    fullContent: '/blog/blogContent/8.md',
    imageUrl: '/blog/Blog-8.png',
    accentColor: 'black-400'
  },
  {
    id: '09',
    title: 'Avantazhi i Vërtetë i Klimës Inteligjente - Kontroll i Plotë nga Çdo Cep i Botës',
    subtitle: 'Jetoni Jashtë? Kontrolloni Klimën në Kosovë sikur të ishit Aty: Zbuloni Fuqinë e Wi-Fi',
    content: "Një Klik Larg: Si Wi-Fi po Revolucionarizon Komoditetin!",
    fullContent: '/blog/blogContent/9.md',
    imageUrl: '/blog/Blog-9.jpg',
    accentColor: 'black-400'
  }
];