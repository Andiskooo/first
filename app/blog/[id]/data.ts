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
    title: 'Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerit CANDY',
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
  },
  {
    id: '10',
    title: 'Cili është ndryshimi midis pompave termike monobllok dhe atyre split(dy njësi)?',
    subtitle: 'Cili është sistemi më i mirë për shtëpinë tuaj?',
    content: "Ndryshimet kryesore midis pompave termike monobllok dhe atyre split(dy njësi)",
    fullContent: '/blog/blogContent/10.md',
    imageUrl: '/blog/Blog-10.png',
    accentColor: 'black-400'
  },
  {
    id: '11',
    title: 'Si funskjonon pastrimi i ajrit nga Klimat?',
    subtitle: 'A kanë të gjithë kondicionerët pastrues ajri?. ',
    content: "Po, kondicioneri juaj mund të përmirësojë cilësinë e ajrit të brendshëm në shtëpinë tuaj.",
    fullContent: '/blog/blogContent/11.md',
    imageUrl: '/blog/Blog-11.png',
    accentColor: 'black-400'
  },
  {
    id: '12',
    title: 'Dallimi mes Gazit R32 dhe R410A: Një Krahasim i Gjithanshëm?',
    subtitle: 'Efiçienca dhe Performanca?. ',
    content: "Dallimi më kritik midis dy ftohësve qëndron në ndikimin e tyre në mjedis.",
    fullContent: '/blog/blogContent/12.md',
    imageUrl: '/blog/Blog-12.webp',
    accentColor: 'black-400'
  },
  {
    id: '13',
    title: 'Si dhe Pse Kondicionerët Prodhojnë Ujë: Shpjegimi i Plotë?',
    subtitle: 'Mësoni pse prodhimi i ujit është shenjë e një kondicioneri efikas.',
    content: "Pse kondicioneri juaj prodhon ujë, dhe a është ky një proces normal dhe thelbësor për ftohjen dhe largimin e lagështisë nga ajri.",
    fullContent: '/blog/blogContent/13.md',
    imageUrl: '/blog/Blog-13.webp',
    accentColor: 'black-400'
  }

];