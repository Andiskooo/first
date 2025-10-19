export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fullContent: string;
  imageUrl: string;
  date: string; // CHANGED: Made date a required field
  accentColor?: string;
  tags?: string[];
};

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: '01',
    title: 'Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerit CANDY',
    subtitle: 'Përdorimi i Aplikacionit hOn',
    date: '2025-07-06', // ADDED
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
    date: '2025-07-07', // ADDED
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
    date: '2025-07-08', // ADDED
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
    date: '2025-07-09', // ADDED
    content: "Si të përcaktoni kapacitetin optimal të pompës termike për shtëpinë tuaj?",
    fullContent: '/blog/blogContent/4.md',
    imageUrl: '/blog/Blog-4.jpg',
    accentColor: 'orange-600'
  },
  {
    id: '05',
    title: 'Si të Zgjidhni Kapacitetin e sakët për Kondicjoner Candy Split?',
    subtitle: 'Faktorët që duhen marrë parasysh për të zgjidhur njësinë e duhur',
    date: '2025-07-10', // ADDED
    content: "Zgjedhja e kondicionerit të duhur Candy mini split përfshin më shumë sesa thjesht përputhjen e një vlerësimi BTU me madhësinë e dhomës suaj.",
    fullContent: '/blog/blogContent/5.md',
    imageUrl: '/blog/Blog-5.jpg',
    accentColor: 'blue-600'
  },
  {
    id: '06',
    title: 'Çfarë Do të Thotë me të Vërtetë Termi "BTU"?',
    subtitle: 'Guida e Plotë për BTU: Si të Zgjidhni Kondicionerin e Duhur',
    date: '2025-07-11', // ADDED
    content: "Në këtë artikull, ne do të diskutojmë se çfarë është një BTU, sa BTU ju nevojiten për shtëpinë tuaj.",
    fullContent: '/blog/blogContent/6.md',
    imageUrl: '/blog/Blog-6.jpg',
    accentColor: 'purple-600'
  },
  {
    id: '07',
    title: 'Pse Instalimi Profesional i Klimës është më i rëndësishëm se Marka që zgjidhni!',
    subtitle: 'Kostot e fsheta nga instalimi jo profesjonal i klimës ',
    date: '2025-07-12', // ADDED
    content: "Kondicioneri juaj i ri nuk do t'ju ngrohë këtë dimër nëse nuk instalohet si duhet. Mësoni si të mbroni investimin tuaj!",
    fullContent: '/blog/blogContent/7.md',
    imageUrl: '/blog/Blog-7.jpg',
    accentColor: 'black-400'
  },
  {
    id: '08',
    title: 'Si Funksionon Sistemi i Pompës Termike për Ngrohje Qëndrore dhe Ujë të Nxehtë',
    subtitle: 'Si një Valvul Tre-Kahëorshe Mundëson Përdorimin e Dyfishtë të Pompës Tuaj Termike',
    date: '2025-07-13', // ADDED
    content: "Përdorimi i Dyfishtë: Si Një Pompë Termike Ngroh Shtëpinë dhe Ujin Sanitar Tuaj!",
    fullContent: '/blog/blogContent/8.md',
    imageUrl: '/blog/Blog-8.png',
    accentColor: 'black-400'
  },
  {
    id: '09',
    title: 'Avantazhi i Vërtetë i Klimës Inteligjente - Kontroll i Plotë nga Çdo Cep i Botës',
    subtitle: 'Jetoni Jashtë? Kontrolloni Klimën në Kosovë sikur të ishit Aty: Zbuloni Fuqinë e Wi-Fi',
    date: '2025-07-14', // ADDED
    content: "Një Klik Larg: Si Wi-Fi po Revolucionarizon Komoditetin!",
    fullContent: '/blog/blogContent/9.md',
    imageUrl: '/blog/Blog-9.jpg',
    accentColor: 'black-400'
  },
  {
    id: '10',
    title: 'Cili është ndryshimi midis pompave termike monobllok dhe atyre split(dy njësi)?',
    subtitle: 'Cili është sistemi më i mirë për shtëpinë tuaj?',
    date: '2025-07-15', // ADDED
    content: "Ndryshimet kryesore midis pompave termike monobllok dhe atyre split(dy njësi)",
    fullContent: '/blog/blogContent/10.md',
    imageUrl: '/blog/Blog-10.png',
    accentColor: 'black-400'
  },
  {
    id: '11',
    title: 'Si funskjonon pastrimi i ajrit nga Klimat?',
    subtitle: 'A kanë të gjithë kondicionerët pastrues ajri?. ',
    date: '2025-07-16', // ADDED
    content: "Po, kondicioneri juaj mund të përmirësojë cilësinë e ajrit të brendshëm në shtëpinë tuaj.",
    fullContent: '/blog/blogContent/11.md',
    imageUrl: '/blog/Blog-11.png',
    accentColor: 'black-400'
  },
  {
    id: '12',
    title: 'Dallimi mes Gazit R32 dhe R410A: Një Krahasim i Gjithanshëm?',
    subtitle: 'Efiçienca dhe Performanca?. ',
    date: '2025-07-17', // ADDED
    content: "Dallimi më kritik midis dy ftohësve qëndron në ndikimin e tyre në mjedis.",
    fullContent: '/blog/blogContent/12.md',
    imageUrl: '/blog/Blog-12.webp',
    accentColor: 'black-400'
  },
  {
    id: '13',
    title: 'Si dhe Pse Kondicionerët Prodhojnë Ujë: Shpjegimi i Plotë?',
    subtitle: 'Mësoni pse prodhimi i ujit është shenjë e një kondicioneri efikas.',
    date: '2025-07-18', // ADDED - Today's Date
    content: "Pse kondicioneri juaj prodhon ujë, dhe a është ky një proces normal dhe thelbësor për ftohjen dhe largimin e lagështisë nga ajri.",
    fullContent: '/blog/blogContent/13.md',
    imageUrl: '/blog/Blog-13.webp',
    accentColor: 'black-400'
  },
  {
    id: '14',
    title: 'Çfarë janë Fan Coil-at Horizontalë të Dyshemesë dhe si Funksionon?',
    subtitle: 'Mësoni më shumë për modelet e ndrryshme të paisjeve për nxehmje.',
    date: '2025-07-29', // ADDED - Today's Date
    content: "Zgjidhja Shumëfunksionale për Komfortin Modern në Shtëpi: Fan Coil-at Horizontalë të Dyshemesë.",
    fullContent: '/blog/blogContent/14.md',
    imageUrl: '/blog/Blog-14.png',
    accentColor: 'black-400'
  },
  {
    id: '15',
    title: 'Si E Bllokon Izolimi Transferimin e Nxehtësisë?',
    subtitle: 'Mbrojtja e Shtëpisë Tuaj.',
    date: '2025-08-08', // ADDED - Today's Date
    content: "Izolimi i shtëpisë është çelësi për të ruajtur një temperaturë të rehatshme të brendshme dhe për të ulur faturat e energjisë.",
    fullContent: '/blog/blogContent/15.md',
    imageUrl: '/blog/Blog-15.jpg',
    accentColor: 'black-400'
  },
  {
    id: '16',
    title: 'Gazi R290: Revolucioni i Gjelbër dhe Efikas në Ngrohjen e Shtëpisë Tuaj me Pompa Termike',
    subtitle: 'R290 – Zgjedhja Superiore për Temperaturë të Lartë dhe Efikasitet',
    date: '2025-02-09', // ADDED - Today's Date
    content: "Gazrat e Ndryshëm në Zemër të Pompës Termike",
    fullContent: '/blog/blogContent/16.md',
    imageUrl: '/blog/Blog-16.jpg',
    accentColor: 'black-400'
  },
  {
    id: '17',
    title: 'Për cfar shërbejnë ventilatorët apo fluturat në pompa termike, si funksjonojin ato? ',
    subtitle: 'Roli Jetik i Ventilatorëve në Pompat Termike: Si Funksionon Ngrohja',
    date: '2025-09-10', // ADDED - Today's Date
    content: "Cikli i Gazit: Nga i Ngrohtë në të Ftohtë",
    fullContent: '/blog/blogContent/17.md',
    imageUrl: '/blog/Blog-17.jpg',
    accentColor: 'black-400'
  },
  {
    id: '18',
    title: 'Si të Zgjidhni Kapacitetin e Duhur të Pompës Termike për Shtëpinë Tuaj ',
    subtitle: 'RFaktorët Kryesorë që Përcaktojnë Kapacitetin e Nevojshëm',
    date: '2025-09-18', // ADDED - Today's Date
    content: "Rregulli i përgjithshëm: Nevojitet afërsisht 0.08 kW fuqi për çdo meter katrore hapësirë.",
    fullContent: '/blog/blogContent/18.md',
    imageUrl: '/blog/Blog-18.png',
    accentColor: 'black-400'
  },
  {
    id: '19',
    title: 'Funksionimi i Akumuluesit Buffer për Pompat Termike: Një Udhëzues i Plotë',
    subtitle: 'Kur dhe Pse Nevojitet një Akumulues Buffer?',
    date: '2025-09-18', // ADDED - Today's Date
    content: "Çfarë është dhe si Funksionon Akumuluesi Buffer?",
    fullContent: '/blog/blogContent/19.md',
    imageUrl: '/blog/Blog-19.jpg',
    accentColor: 'black-400'
  },
  {
    id: '20',
    title: 'Sa do të më kushtojë instalimi i pompës termike?',
    subtitle: 'Çfarë paisjesh përcjellëse i duhen pompës termike?',
    date: '2025-10-19', // ADDED - Today's Date
    content: "Për të pasur një sistem funksional, ju duhet të llogarisni edhe koston e të gjitha pajisjeve ndihmëse.",
    fullContent: '/blog/blogContent/20.md',
    imageUrl: '/blog/Blog-20.png',
    accentColor: 'black-400'
  }
];