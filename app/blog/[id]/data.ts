// Blog post data types and mock data
export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fullContent: string; // Added full content parameter
  imageUrl: string;
  link: string;
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
    link: '/blog/1',
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
    link: '/blog/dirty-sock-ac',
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
    link: '/blog/ac-leaking-water',
    accentColor: 'green-600'
  },
  {
    id: '04',
    title: 'Si të Zgjidhni një Pompë Nxehtësie?',
    subtitle: 'Çfarë duhet të merrni parasysh para blerjes',
    content: "Si të përcaktoni kapacitetin optimal të pompës termike për shtëpinë tuaj?",
    fullContent: '/blog/blogContent/4.md',
    imageUrl: '/blog/Blog-4.jpg',
    link: '/blog/extend-ac-life',
    accentColor: 'orange-600'
  },
];