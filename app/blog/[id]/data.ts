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
  }
];